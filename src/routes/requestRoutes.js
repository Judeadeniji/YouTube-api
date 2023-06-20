const express = require("express");
const router = express.Router();
const youtubeApi = require("../services/youtube-api");
const { getDataCache, setDataCache } = require("../services/cache");

// Endpoint 5: Search
router.get("/search", async (req, res) => {
  const { q: searchQuery, max, category } = req.query;
  const cacheKey = `/search?q=${searchQuery}&max=${max}&category=${category}`;
  let searchResults = getDataCache(cacheKey);

  if (!searchResults) {
    searchResults = await youtubeApi.searchVideos(searchQuery, max, category);
    if (!searchResults.error) {
      setDataCache(cacheKey, searchResults);
    }
  }

  res.json(searchResults);
});

// Endpoint 17: PlaylistItems
router.get("/playlist-items", async (req, res) => {
  const { playlistId, max, category } = req.query;
  const cacheKey = `/playlist-items?playlistId=${playlistId}&max=${max}&category=${category}`;
  let playlistItems = getDataCache(cacheKey);

  if (!playlistItems) {
    playlistItems = await youtubeApi.getPlaylistItems(
      playlistId,
      max,
      category
    );
    if (!playlistItems.error) {
      setDataCache(cacheKey, playlistItems);
    }
  }

  res.json(playlistItems);
});

// Endpoint 18: Playlists
router.get("/playlists", async (req, res) => {
  const { channelId, max, category, chart } = req.query;
  const cacheKey = `/playlists?channelId=${channelId}&max=${max}&category=${category}&chart=${chart}`;
  let playlists = getDataCache(cacheKey);

  if (!playlists) {
    playlists = await youtubeApi.getPlaylists(channelId, max, category);
    if (!playlists.error) {
      setDataCache(cacheKey, playlists);
    }
  }

  res.json(playlists);
});

// Endpoint 20: Subscriptions
router.get("/subscriptions", async (req, res) => {
  const { channelId, max } = req.query;
  const cacheKey = `/subscriptions?channelId=${channelId}&max=${max}`;
  let subscriptions = getDataCache(cacheKey);

  if (!subscriptions) {
    subscriptions = await youtubeApi.getSubscriptions(channelId, max);
    if (!subscriptions.error) {
      setDataCache(cacheKey, subscriptions);
    }
  }

  res.json(subscriptions);
});

// Endpoint 24: VideoCategories
router.get("/video-categories", async (req, res) => {
  const { id, regionCode, max } = req.query;
  const cacheKey = `/video-categories?id=${id}&regionCode=${regionCode}&max=${max}`;
  let videoCategories = getDataCache(cacheKey);

  if (!videoCategories) {
    videoCategories = await youtubeApi.getVideoCategories(id, regionCode, max);
    if (!videoCategories.error) {
      setDataCache(cacheKey, videoCategories);
    }
  }

  res.json(videoCategories);
});

// Endpoint 25: Videos
router.get("/videos", async (req, res) => {
  const { regionCode, max, chart } = req.query;
  const cacheKey = `/videos?regionCode=${regionCode}&max=${max}&chart=${chart}`;
  let videos = getDataCache(cacheKey);

  if (!videos) {
    videos = await youtubeApi.getVideos(regionCode, max, chart);
    if (!videos.error) {
      setDataCache(cacheKey, videos);
    }
  }

  res.json(videos);
});

// Additional endpoints
router.get("/most-popular-videos", async (req, res) => {
  const { max, category } = req.query;
  const cacheKey = `/most-popular-videos?max=${max}&category=${category}`;
  let popularVideos = getDataCache(cacheKey);

  if (!popularVideos) {
    popularVideos = await youtubeApi.getMostPopularVideos(max, category);
    if (!popularVideos.error) {
      setDataCache(cacheKey, popularVideos);
    }
  }

  res.json(popularVideos);
});

router.get("/most-viewed-videos", async (req, res) => {
  const { max, publishedBefore, publishedAfter } = req.query;
  const cacheKey = `/most-viewed-videos?max=${max}&publishedBefore=${publishedBefore}&publishedAfter=${publishedAfter}`;
  let viewedVideos = getDataCache(cacheKey);

  if (!viewedVideos) {
    viewedVideos = await youtubeApi.getMostViewedVideos(
      max,
      publishedBefore,
      publishedAfter
    );
    if (!viewedVideos.error) {
      setDataCache(cacheKey, viewedVideos);
    }
  }

  res.json(viewedVideos);
});

router.get("/most-popular-by-region", async (req, res) => {
  const { regionCode, max, category } = req.query;
  const cacheKey = `/most-popular-by-region?regionCode=${regionCode}&max=${max}&category=${category}`;
  let popularVideos = getDataCache(cacheKey);

  if (!popularVideos) {
    popularVideos = await youtubeApi.getMostPopularByRegion(
      regionCode,
      max,
      category
    );
    if (!popularVideos.error) {
      setDataCache(cacheKey, popularVideos);
    }
  }

  res.json(popularVideos);
});

router.get("/most-popular-by-category", async (req, res) => {
  const { videoCategoryId, max, category } = req.query;
  const cacheKey = `/most-popular-by-category?videoCategoryId=${videoCategoryId}&max=${max}&category=${category}`;
  let popularVideos = getDataCache(cacheKey);

  if (!popularVideos) {
    popularVideos = await youtubeApi.getMostPopularByCategory(
      videoCategoryId,
      max,
      category
    );
    if (!popularVideos.error) {
      setDataCache(cacheKey, popularVideos);
    }
  }

  res.json(popularVideos);
});

router.get("/thumbnails", async (req, res) => {
  const { v: videoId } = req.query;
  const cacheKey = `/thumbnails?v=${videoId}`;
  let thumbnails = getDataCache(cacheKey);

  if (!thumbnails) {
    thumbnails = await youtubeApi.getVideoThumbnails(videoId);
    if (!thumbnails.error) {
      setDataCache(cacheKey, thumbnails);
    }
  }

  res.json(thumbnails);
});

module.exports = router;
