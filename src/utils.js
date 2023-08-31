const path = require('path');
const CHALLENGE_DIRECTORY = process.env.CHALLENGE_DIRECTORY || '/var/www/html/.well-known/acme-challenge';

function handleRedirect(req, res, location) {
    res.writeHead(301, { 'Location': location });
    res.end();
};
  
function handleNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found\n');
};

function handleMethodNotAllowed(res) {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('405 Method Not Allowed\n');
};

function getRouteHandlerName(url) {
    const sanitizedUrl = url.endsWith('/') ? url.slice(0, -1) : url; 
    return sanitizedUrl.substr(1);
};
  
function sanitizeToken(token) {
    // Prevent poison null bytes
    if (token.indexOf('\0') !== -1) {
      return null;
    }
  
    // Whitelist characters
    if (!/^[a-zA-Z0-9]+$/.test(token)) {
      return null;
    }
  
    // Prevent directory traversal
    const rootDirectory = path.resolve('/var/www/html'); // Get absolute path
    const safePath = path.normalize(token).replace(/^(\.\.(\/|\\|$))+/, '');
    const filename = path.join(CHALLENGE_DIRECTORY, safePath);

    if (filename.indexOf(rootDirectory) !== 0) {
      return null;
    }
  
    return safePath;
}

module.exports = { 
    handleNotFound, 
    handleRedirect,
    handleMethodNotAllowed,
    getRouteHandlerName,
    sanitizeToken
};