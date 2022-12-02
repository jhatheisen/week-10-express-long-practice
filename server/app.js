const express = require('express');
const app = express();
const path = require('path');


// phase 1

// use static for assets
app.use('/static', express.static(path.join(__dirname, 'assets')));
// middleware to use .json for all json bodies
app.use(express.json());
// require async errors
require('express-async-errors');

// phase 2

// middleware function
const logger = (req, res, next) => {
  // logs url and method
  console.log(`${req.method} ${req.url}`);
  // want to show status, but runs before res is made
  // res.on is event listener, when res finished
  // print status code
  res.on('finish', () => {
    console.group();
    console.log(`Status Code - ${res.statusCode}`);
    console.groupEnd();
  });
  // goes next so not hanging
  next();
};
// middleware to use logger
app.use(logger);




// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

// phase 2
// if nothing else sends a res, couldn't be found error
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.statusCode = 404;
  throw err;
});

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
