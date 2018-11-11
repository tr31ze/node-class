/*
Primary file for the API
 */

//Dependencies
const http  = require('http');
const https = require('https');
const url   = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

//respond to all requests with string
const httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
});

//start the server

httpServer.listen(config.httpPort, function() {
    console.log(`Server is listening on port ${config.httpPort} `);
});

//inst the HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pe')
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

//Start HTTPS server
httpsServer.listen(config.httpsPort, function() {
    console.log(`Server is listening on port ${config.httpsPort} `);
});



let unifiedServer = function(req, res) {
    let method = req.method.toLowerCase();
    let parsedUrl = url.parse(req.url, true);

    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    let queryStringObject = parsedUrl.query;

    // get headers object
    let headers = request.headers;

    //get payload
    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();

        //choose handler for the request

        let handler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        let data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        handler(data, function (status, payload) {
            status = typeof (status) === 'number' ? status : 200;

            payload = typeof (payload) === 'object' ? payload : {};

            let payloadString = JSON.stringify(payload);

            // return response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(status);
            res.end(payloadString);

            console.log('buffer', buffer);
            console.log('reponse', status, payloadString);
        });
        console.log('path', path);
        console.log('trimmedPath', trimmedPath);
        console.log('method', method);
    });
};

let handlers = {};

handlers.ping = function(data, callback) {
  callback(200);
};

handlers.hello = function(data, callback) {
    callback(200, {message: 'Hello there'});
};

handlers.notFound = function(data, callback) {
    callback(404);
};

//router
let router = {
  'ping': handlers.ping,
    'hello': handlers.hello
};