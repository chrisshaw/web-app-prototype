var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// var methodOverride = require('method-override');
var PORT = process.env.PORT || 8080;
var app = express();
var cookieParser = require('cookie-parser');
const api = require('./routes/apiController.js')

// middle ware to get and set cookies -- needed for foxxService to set cookies for sid
app.use(cookieParser());

// Serve static content for the app from the "public" directory in the application directory.
// this goes before any body-parser calls - static files don't need parsing.
app.use("/public", express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded 
// found urlencoded extended must be true for nested arrays and for post method
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(bodyParser.text({ type: 'text/html' }));

api(app)

app.listen(PORT);