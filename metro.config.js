const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix MIME type issue for web bundler - ensure JavaScript bundles are served with correct MIME type
config.server = config.server || {};
config.server.rewriteRequestUrl = (url) => {
  return url;
};

// Add middleware to fix MIME type headers
const originalEnhanceMiddleware = config.server.enhanceMiddleware;

config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    // Fix MIME type for bundle requests
    const originalSetHeader = res.setHeader;
    res.setHeader = function(name, value) {
      if (name.toLowerCase() === 'content-type' && value === 'application/json') {
        // Force JavaScript MIME type for bundle files
        if (req.url.includes('bundle?') || req.url.includes('.bundle')) {
          value = 'application/javascript';
        }
      }
      return originalSetHeader.call(this, name, value);
    };

    // Call the original middleware
    if (originalEnhanceMiddleware) {
      return originalEnhanceMiddleware(middleware)(req, res, next);
    } else {
      return middleware(req, res, next);
    }
  };
};

module.exports = config;
