const requests = {
  
}

// Middleware to prevent excessive calling of a resource
const rateLimit = (req, res, next) => {
  // Define the maximum number of requests allowed
  const maxRequests = 5;

  // Define the time frame in milliseconds (e.g., 1 hour)
  const timeFrame = 60000;

  // Retrieve the client's IP address
  const clientIP = req.ip;
  
  // Check if the client's IP is stored in the request's session
  const clientRequests = requests[clientIP];

  // If the client's IP is not stored or the stored requests have expired,
  // initialize a new entry in the session and set the request count to 1
  if (!clientRequests || (clientRequests.timestamp + timeFrame) < Date.now()) {
    requests[clientIP] = {
      count: 1,
      timestamp: Date.now()
    };
    next();
  } else {
    // If the client's IP is already stored and the requests are within the time frame,
    // increment the request count
    requests[clientIP].count++;

    // If the request count exceeds the maximum allowed requests, send a response with a 429 status code (Too Many Requests)
    if (requests[clientIP].count > maxRequests) {
      return res.status(429).json({ error: true, message: 'Too Many Requests' });
    }

    next();
  }
};

module.exports = () => rateLimit;