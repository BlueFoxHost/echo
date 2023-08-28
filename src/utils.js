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
  
module.exports = { 
    handleNotFound, 
    handleRedirect,
    handleMethodNotAllowed,
    getRouteHandlerName
};