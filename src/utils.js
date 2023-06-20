const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Helper function to sanitize filename
function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Schedule file deletion after the specified time
function scheduleFileDeletion(filePath, expirationTime) {
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error removing temporary file (${filePath}):`, err);
      } else {
        console.log(`Temporary file (${filePath}) removed`);
      }
    });
  }, expirationTime);
}

function dynamicRequire(modulePath) {
  const modulePromise = import(modulePath);
  let moduleExports = null;

  modulePromise.then((module) => {
    moduleExports = module.default || module;
  });

  // Return a function that can be called to get the exports synchronously
  return () => {
    if (moduleExports !== null) {
      return moduleExports;
    } else {
      throw new Error(`Module "${modulePath}" has not been loaded yet.`);
    }
  };
}


module.exports = {
  sanitizeFilename,
  scheduleFileDeletion,
  dynamicRequire
};
