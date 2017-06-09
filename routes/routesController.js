
var path = require('path');

module.exports = function(app){


    app.get('/', function(req, res){
        // main entry point
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })

}
