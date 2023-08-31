const https = require('node:https');
const http = require('node:http');
const fs = require('node:fs');
const path = require('path');
const { handleNotFound, handleRedirect, handleMethodNotAllowed, getRouteHandlerName, sanitizeToken } = require('./utils');
const { start } = require('node:repl');

const HOST = process.env.HOST|| '0.0.0.0';
const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 3000;
const CHALLENGE_DIRECTORY = process.env.CHALLENGE_DIRECTORY || '/var/www/html/.well-known/acme-challenge/';
const DOMAIN = process.env.DOMAIN;
if (!DOMAIN) throw new Error('CRITICAL ERROR: NO DOMAIN VARIABLE SPECIFIED IN ENV.')

const certPath =  `/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`
const keyPath =  `/etc/letsencrypt/live/${DOMAIN}/privkey.pem`

function loadRouteHandlers() {
  const routeHandlers = {};
  const routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));

  routeFiles.forEach(file => {
    const routeName = path.basename(file, '.js');
    routeHandlers[routeName] = require(`./routes/${routeName}`);
  });

  return routeHandlers;
};


const routeHandlers = loadRouteHandlers();

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
    /*
    const sanitizedToken = sanitizeToken(CHALLENGE_DIRECTORY, challengeToken); // Prevent directory traversal.
    if (!sanitizedToken) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Bad Request');
      return;
    }
    */
    const filePath = path.join(CHALLENGE_DIRECTORY, challengeToken);
    
    // Read the challenge response from the file
    fs.readFile(filePath, 'utf8', (err, challengeResponse) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(err);
        return;
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(challengeResponse);
        return;
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

  handleRequest(req, res, routeHandlers);

});

httpServer.listen(HTTP_PORT, HOST, () => {
  console.log(`Server is listening on ${HTTP_PORT}.\nServer is available at http://${HOST}:${HTTP_PORT}`);
});

//---- HTTPS SERVER ----
function startHTTPS() {
  const options = {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  };
  const httpsServer = https.createServer(options, (req, res) => {

    handleRequest(req, res, routeHandlers);

  });

  httpsServer.listen(HTTPS_PORT, HOST, () => {
    console.log(`HTTPS Server is listening on ${HTTPS_PORT}.\nHTTPS Server is available at https://${DOMAIN}:${HTTPS_PORT}`);
  });
}

// This is needed as certbot has to issue the certs first...
const sslFilesCheckInterval = setInterval(() => {
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    startHTTPS();
    clearInterval(sslFilesCheckInterval);
  }
}, 1000); // Check every second

function handle(signal) {
  console.log(`*^!@4=> Received event: ${signal}`)
  process.exit()
}
process.on('SIGHUP', handle)