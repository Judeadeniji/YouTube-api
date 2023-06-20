const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const { getVideoInfo } = require("../services/youtubeService");
const stream = require("stream");


const tempMediaDir = path.join(process.cwd(), "temp");

// Create the temporary media directory if it doesn't exist
if (!fs.existsSync(tempMediaDir)) {
  fs.mkdirSync(tempMediaDir);
}

// Expiration time for the temporary media files (2 hours)
const expirationTime = 2 * 60 * 60 * 1000;

async function processVideo(externalUrl) {
 let UtilitiJs;
  try {
    UtilitiJs = await import("utiliti-js/dist/index.js");
    const http = new UtilitiJs.Http();
    const response = await http.get(externalUrl);
    return stream.Readable.from(response.body);
  } catch (e) {
    console.error("fire 🔥", e)
  }
}

async function fetchVideoData(videoURL) {
  const videoInfo = await getVideoInfo(videoURL);

  const formats = videoInfo.formats;
  const videos = [];
  const audios = [];

  formats.forEach(format => {
    if (format.hasVideo && format.hasAudio) {
      videos.push(format);
    } else if (!format.hasVideo && format.hasAudio) {
      audios.push(format);
    }
  });

  return {
    title: videoInfo.title,
    videoInfo,
    videos,
    audios,
  };
}

module.exports = {
  fetchVideoData,
  processVideo
};
