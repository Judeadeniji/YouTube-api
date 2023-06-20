const ytdl = require('ytdl-core');
const { youtubeCache } = require('./cache');

async function getVideoInfo(videoURL) {
  // Check if the video info is already cached
  const cachedVideoInfo = youtubeCache.get(videoURL);
  if (cachedVideoInfo) {
    return cachedVideoInfo;
  }

  const videoInfo = await ytdl.getInfo(videoURL);
  
  // Cache the video info
  youtubeCache.set(videoURL, videoInfo);

  return videoInfo;
}

module.exports = {
  getVideoInfo
};
