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
  
function sanitizeToken(root, token) {

    if (token.indexOf('\0') !== -1) {
        return false;
    }
    
    if (!/^[\w-]+$/.test(token)) {
        return false;
    }

    var safeInput = path.normalize(token).replace(/^(\.\.(\/|\\|$))+/, '');
    var pathString = path.join(root, safeInput);
    if (pathString.indexOf(root) !== 0) {
        return false;
    }
    return pathString;
}

module.exports = { 
    handleNotFound, 
    handleRedirect,
    handleMethodNotAllowed,
    getRouteHandlerName,
    sanitizeToken
};