const https = require('node:https');
const http = require('node:http');
const fs = require('node:fs');
const path = require('path');
const { handleNotFound, handleRedirect, handleMethodNotAllowed, getRouteHandlerName, sanitizeToken } = require('./utils');

const HOST = process.env.HOST|| '0.0.0.0';
const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 3000;
const CHALLENGE_DIRECTORY = process.env.CHALLENGE_DIRECTORY || '/var/www/html/.well-known/acme-challenge';
const DOMAIN = process.env.DOMAIN;
if (!DOMAIN) throw new Error('CRITICAL ERROR: NO DOMAIN VARIABLE SPECIFIED IN ENV.')

const options = {
  cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`),
  key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
};

function handleRequest(req, res, routeHandlers) {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  const { method, url } = req;

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  };

  if (method !== "GET") return handleMethodNotAllowed(res); // GET only from this point on.

  if (url === '/') return handleRedirect(req, res, 'https://bluefoxhost.com');
  if (req.url.startsWith('/.well-known/acme-challenge/')) {
    const challengeToken = req.url.split('/').pop(); // Extract the challenge token from the URL
    const sanitizedToken = sanitizeToken(challengeToken); // Prevent directory traversal.
    if (!sanitizedToken) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
      return;
    }
    
    const filePath = path.join(CHALLENGE_DIRECTORY, sanitizedToken);
    
    // Read the challenge response from the file
    fs.readFile(filePath, 'utf8', (err, challengeResponse) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(challengeResponse);
      }
    });
  }

  const routeHandlerName = getRouteHandlerName(url);
  const routeHandler = routeHandlers[routeHandlerName];
  
  if (routeHandler) {
    routeHandler(req, res);
  } else {
    handleNotFound(res);
  }
}

//---- HTTP SERVER ----

const httpServer = http.createServer((req, res) => {

  const routeHandlers = loadRouteHandlers();
  handleRequest(req, res, routeHandlers);

});

httpServer.listen(PORT, HOST, () => {
  console.log(`Server is listening on ${PORT}.\nServer is available at http://${HOST}:${PORT}`);
});

//---- HTTPS SERVER ----

const httpsServer = http.createServer(options, (req, res) => {

  const routeHandlers = loadRouteHandlers();
  handleRequest(req, res, routeHandlers);

});

httpsServer.listen(PORT, HOST, () => {
  console.log(`HTTPS Server is listening on ${PORT}.\nHTTPS Server is available at https://${DOMAIN}:${PORT}`);
});


function loadRouteHandlers() {
  const routeHandlers = {};
  const routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));

  routeFiles.forEach(file => {
    const routeName = path.basename(file, '.js');
    routeHandlers[routeName] = require(`./routes/${routeName}`);
  });

  return routeHandlers;
};

function handle(signal) {
  console.log(`*^!@4=> Received event: ${signal}`)
  process.exit()
}
process.on('SIGHUP', handle)