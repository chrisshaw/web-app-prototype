
var path = require('path');

module.exports = function(app){
console.log("in controller");

// var path = require('path');
// res.sendFile(path.resolve('temp/index.html'));
    app.get('/', function(req, res){
        // console.log(__dirname, " dir");
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })

}
