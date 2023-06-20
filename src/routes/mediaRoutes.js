// mediaRoute.js

const express = require("express");
const {
  fetchVideoData,
  processVideo,
} = require("../controllers/mediaController");
const { validateVideoId } = require("../middlewares/mediaMiddleware");
const { getResData, setResData } = require("../services/cache");

const router = express.Router();
const qualityRange = {
  small: { minBitrate: 0, maxBitrate: 96 },
  medium: { minBitrate: 97, maxBitrate: 192 },
  high: { minBitrate: 193, maxBitrate: 384 },
};

function logErr(...error) {
  console.log(...error);
}

async function getMetadata(req) {
  let metadata = {};
  const { videoURL, title, videoId } = req;
  const data = getResData(videoId);
  if (data && !data.error) {
    metadata = data.metadata;
    return metadata;
  }

  const { videoInfo, audios, videos } = await fetchVideoData(videoURL);

  // Get available audio and video qualities based on bitrate
  const audioQualities = getAvailableQualities(audios);
  const videoQualities = getAvailableQualities(videos);

  // Send JSON response with metadata and URLs for streaming audio and video
  const response = {
    title: videoInfo.videoDetails.title,
    audios,
    audioQualities,
    videos,
    videoQualities,
    videoDetails: videoInfo.videoDetails,
  };
  setResData(videoId, {
    metadata: response,
  });
  metadata = response;

  return metadata;
}

function getAvailableQualities(mediaList) {
  return Object.keys(qualityRange).filter((key) =>
    mediaList.some(
      (media) =>
        media.audioBitrate >= qualityRange[key].minBitrate &&
        media.audioBitrate <= qualityRange[key].maxBitrate
    )
  );
}

function getStreamByQuality(mediaList, quality) {
  const selectedQuality = Object.keys(qualityRange).find(
    (key) => quality === key
  );
  if (!selectedQuality) {
    return mediaList.reduce((prev, curr) =>
      prev.audioBitrate > curr.audioBitrate ? prev : curr
    );
  } else {
    return mediaList.find(
      (media) =>
        media.audioBitrate >= qualityRange[selectedQuality].minBitrate &&
        media.audioBitrate <= qualityRange[selectedQuality].maxBitrate
    );
  }
}

function handleErrors(routeHandler) {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res, next);
    } catch (error) {
      logErr("Error:", error);
    }
  };
}

router.get(
  "/audio",
  validateVideoId,
  handleErrors(async (req, res) => {
    const { quality, type } = req;
    const metadata = await getMetadata(req);
    const { audios } = metadata;
    if (!audios) {
      return res.json({
        error: true,
        message: "Audio Not Found",
      });
    }

    if (type === "json") {
      if (!quality) {
        const smallestAudio = audios.reduce((prev, curr) =>
          prev.audioBitrate < curr.audioBitrate ? prev : curr
        );
        console.log(quality)
        return res.json(smallestAudio);
      } else {
        const selectedAudio = getStreamByQuality(audios, quality);
        console.log(quality)
        return res.json(selectedAudio);
      }
    }

    let UtilitiJs;
    try {
      UtilitiJs = await import("utiliti-js/dist/index.js");
    } catch (error) {
      logErr("Error:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }

    const http = new UtilitiJs.Http();
    let audioStream;
    if (!quality) {
      const smallestAudio = audios.reduce((prev, curr) =>
        prev.audioBitrate < curr.audioBitrate ? prev : curr
      );
      audioStream = await processVideo(smallestAudio.url);
    } else {
      const selectedAudio = getStreamByQuality(audios, quality);
      audioStream = await processVideo(selectedAudio.url);
    }

    res.set("Content-Type", "audio/mpeg");

    audioStream.on("error", (error) => {
      logErr("Stream Error:", error);
    });

    audioStream.pipe(res);
  })
);

router.get(
  "/video",
  validateVideoId,
  handleErrors(async (req, res) => {
    const { quality, type } = req;
    const metadata = await getMetadata(req);
    const { videos } = metadata;
    if (!videos || videos.length < 1) {
      return res.json({
        error: true,
        message: "Video Not Found",
      });
    }

    if (type === "json") {
      if (!quality) {
        const smallestVideo = videos.reduce((prev, curr) =>
          prev.audioBitrate < curr.audioBitrate ? prev : curr
        );
        return res.json(smallestVideo);
      } else {
        const selectedVideo = getStreamByQuality(videos, quality);
        return res.json(selectedVideo);
      }
    }

    let videoStream;
    if (!quality) {
      const smallestVideo = videos.reduce((prev, curr) =>
        prev.audioBitrate < curr.audioBitrate ? prev : curr
      );
      videoStream = await processVideo(smallestVideo.url);
    } else {
      const selectedVideo = getStreamByQuality(videos, quality);
      videoStream = await processVideo(selectedVideo.url);
    }

    res.set("Content-Type", "video/mp4");

    videoStream.on("error", (error) => {
      logErr("Stream Error:", error);
    });

    videoStream.pipe(res);
  })
);

router.get(
  "/",
  validateVideoId,
  handleErrors(async (req, res) => {
    const metadata = await getMetadata(req);
    res.json(metadata);
  })
);

module.exports = router;
