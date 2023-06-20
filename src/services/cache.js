const fs = require('fs');
const path = require('path');

// File path to store the cache data
const cacheFilePath = path.join(__dirname, 'db.json');

// Expiration time for the cached video information (8 hours)
const expirationTime = 60 * 60 * 8;

// Load cache data from the JSON file
let cacheData = {};
if (fs.existsSync(cacheFilePath)) {
  const fileContent = fs.readFileSync(cacheFilePath, 'utf8');
  cacheData = JSON.parse(fileContent);
}

class Cache {
  constructor(options) {
    this.options = {
      stdTTL: expirationTime,
      ...options
    };
  }

  get(key) {
    const value = cacheData[key];
    if (value) {
      if (this.options.checkperiod && value.__expires <= Date.now()) {
        delete cacheData[key];
        this.saveCacheData();
        return undefined;
      }
      return value;
    }
    return undefined;
  }

  set(key, value, ttl = this.options.stdTTL) {
    const expires = ttl * 1000 + Date.now();
    cacheData[key] = value;
    cacheData[key].__expires = expires;
    this.saveCacheData();
    return true;
  }

  saveCacheData() {
    fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData), 'utf8');
  }
}

const youtubeCache = new Cache({ stdTTL: expirationTime });

const dataCache = new Cache({ stdTTL: expirationTime });

function getResData(videoURL) {
  const response = youtubeCache.get(videoURL);
  if (response) {
    return response;
  }

  return false;
}

function setResData(videoURL, response) {
  return youtubeCache.set(videoURL, response);
}

function getDataCache(key) {
  const response = dataCache.get(key);
  if (response) {
    return response;
  }

  return false;
}

function setDataCache(key, value, ttl) {
  return dataCache.set(key, value, ttl);
}

module.exports = {
  youtubeCache,
  getDataCache,
  setDataCache,
  setResData,
  getResData,
};
