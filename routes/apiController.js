

module.exports = function(app){

   
    var FocusAreaObj = require('../data');
    console.log("FocusAreaObj", FocusAreaObj);
    // get request from client 
    app.get('/focusarea/:year', function(req, res){
        var year = req.params.year; //value ignored for now
        console.log(year);
        // for now send whole object ignoring actual year requested
        res.json(FocusAreaObj);
    })



   
}
