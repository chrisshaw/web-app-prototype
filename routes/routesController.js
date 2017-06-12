
var path = require('path');

module.exports = function(app){


    app.post("/csv/file", function(req, res, next){
        // main entry point
        console.log(req.body.name)   // also req.body.buffer
        // console.log(Buffer.isBuffer(req.body.buffer));
        // need to verify csv file and save contents somewhere...
        var fileContentsFromBuffer = req.body.buffer.toString('utf-8');
        // split on the carriage return
        var csvToArr = fileContentsFromBuffer.split(/\r/);
        // save somewhere - need to do for loop over array, split on comma and save
        console.log(csvToArr);
        // need to confirm expected format for saving to db
        // send ok or reject to client
        res.json();
    })

    app.use(function(req, res){
        // main entry point
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })

}
