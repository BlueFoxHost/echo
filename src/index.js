const http = require('http');
const fs = require('fs');
const path = require('path');
const HOST = process.env.HOST|| '0.0.0.0';
const PORT = process.env.PORT || 8080;
const { handleNotFound, handleRedirect, handleMethodNotAllowed, getRouteHandlerName } = require('./utils');

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

  const routeHandlerName = getRouteHandlerName(url);
  const routeHandler = routeHandlers[routeHandlerName];
  
  if (routeHandler) {
    routeHandler(req, res);
  } else {
    handleNotFound(res);
  }
}

const server = http.createServer((req, res) => {

  const routeHandlers = loadRouteHandlers();
  handleRequest(req, res, routeHandlers);

});


server.listen(PORT, HOST, () => {
  console.log(`Server is listening on ${PORT}.\nServer is available at http://${HOST}:${PORT}`);
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