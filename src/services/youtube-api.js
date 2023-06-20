const { google } = require("googleapis");

const apiKey = "AIzaSyDQyjOxMQb4OhgHkmxcLjE7usCV3XKgRq4";
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

// Endpoint 5: Search
const searchVideos = async (searchQuery, maxResults, videoCategoryId = 10) => {
  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: searchQuery,
      type: "video",
      maxResults: maxResults,
      videoCategoryId,
    });

    const searchResults = response.data;
    // Process the search results
    return searchResults;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Endpoint 17: PlaylistItems
const getPlaylistItems = async (playlistId, maxResults, videoCategoryId = 10) => {
  try {
    const response = await youtube.playlistItems.list({
      part: "snippet,contentDetails",
      playlistId: playlistId,
      maxResults: maxResults,
      videoCategoryId,
    });

    const playlistItems = response.data;
    // Process the playlist items
    return playlistItems;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Endpoint 18: Playlists
const getPlaylists = async (channelId, maxResults, chart, videoCategoryId = 10) => {
  try {
    const response = await youtube.playlists.list({
      part: "snippet,contentDetails",
      channelId: channelId,
      maxResults: maxResults,
      chart,
      videoCategoryId
    });

    const playlists = response.data;
    // Process the playlists
    return playlists;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Endpoint 20: Subscriptions
const getSubscriptions = async (channelId, maxResults) => {
  try {
    const response = await youtube.subscriptions.list({
      part: "snippet",
      channelId: channelId,
      maxResults: maxResults,
    });

    const subscriptions = response.data;
    // Process the subscriptions
    return subscriptions;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Endpoint 24: VideoCategories
const getVideoCategories = async (id, regionCode, maxResults) => {
  try {
    const response = await youtube.videoCategories.list({
      part: "snippet",
      regionCode: regionCode,
      maxResults: maxResults,
      id,
    });

    const videoCategories = response.data;
    // Process the video categories
    return videoCategories;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Endpoint 25: Videos
const getVideos = async (regionCode = "NG", maxResults, chart) => {
  const response = await youtube.videos.list({
    part: "snippet,contentDetails",
    chart: chart || "mostPopularByRegion",
    regionCode: regionCode,
    maxResults: maxResults,
  });
  const videos = response.data;
  return videos;
};

const getMostPopularVideos = async (maxResults, videoCategoryId = 10) => {
  try {
    const response = await youtube.videos.list({
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      maxResults: maxResults,
      videoCategoryId
    });

    const popularVideos = response.data;
    // Process the popular videos
    return popularVideos;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

const getMostViewedVideos = async (
  maxResults,
  publishedBefore,
  publishedAfter
) => {
  try {
    const response = await youtube.videos.list({
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      maxResults: maxResults,
      publishedAfter: publishedAfter || "2023-01-01T00:00:00Z",
      publishedBefore: publishedBefore || "2021-01-01T23:59:59Z",
    });

    const viewedVideos = response.data;
    // Process the viewed videos
    return viewedVideos;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

const getMostPopularByRegion = async (regionCode, maxResults, videoCategoryId = 10) => {
  try {
    const response = await youtube.videos.list({
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: regionCode,
      maxResults: maxResults,
      videoCategoryId
    });

    const popularVideos = response.data;
    // Process the popular videos
    return popularVideos;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

const getMostPopularByCategory = async (videoCategoryId = 10, maxResults) => {
  try {
    const response = await youtube.videos.list({
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      videoCategoryId: videoCategoryId,
      maxResults: maxResults,
    });

    const popularVideos = response.data;
    // Process the popular videos
    return popularVideos;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Endpoint to get video thumbnails
const getVideoThumbnails = async (videoId) => {
  try {
    const response = await youtube.videos.list({
      part: "snippet",
      id: videoId,
    });

    const videoDetails = response.data;
    const thumbnails = videoDetails.items[0].snippet.thumbnails;
    // Process the video thumbnails
    return thumbnails;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

module.exports = {
  getMostPopularByCategory,
  getMostPopularByRegion,
  getMostViewedVideos,
  getMostPopularVideos,
  getVideos,
  getVideoCategories,
  getVideoThumbnails,
  getSubscriptions,
  getPlaylists,
  getPlaylistItems,
  searchVideos,
};
