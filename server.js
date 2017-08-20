var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// var methodOverride = require('method-override');
var PORT = process.env.PORT || 8080;
var app = express();
var cookieParser = require('cookie-parser');

// middle ware to get and set cookies -- needed for foxxService to set cookies for sid
app.use(cookieParser());
// for production
// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = 'auto' // serve secure cookies if possible
// }

// app.use(session(sess));

// Serve static content for the app from the "public" directory in the application directory.
// this goes before any body-parser calls - static files don't need parsing.


// ***  Must comment this out for aws deploy *********///
if (process.env.DB_MODE === 'LOCAL') app.use("/public", express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded 
// found urlencoded extended must be true for nested arrays and for post method
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

// parse an HTML body into a string 
app.use(bodyParser.text({ type: 'text/html' }));
// api routing handled here
require("./routes/apiController.js")(app);
// // routing handled here
// require("./routes/routesController.js")(app);
// 

app.listen(PORT);