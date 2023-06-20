//mediaMiddleware

const { sanitizeFilename } = require("../utils");

function validateVideoId(req, res, next) {
  const { q: quality, v: videoId, type } = req.query;
  if (!videoId) {
    return res.status(400).json({ error: "Missing video_id parameter" });
  }

  req.videoURL = `https://www.youtube.com/watch?v=${videoId}`;
  req.title = sanitizeFilename(videoId);
  req.videoId = videoId;
  req.quality = quality;
  req.type = type;

  next();
}

module.exports = {
  validateVideoId,
};
