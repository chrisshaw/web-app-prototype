
var path = require('path');

module.exports = function(app){

    app.post("/csv/file", function(req, res, next){
        // main entry point
        // need to verify csv file and save contents somewhere...
        var fileContentsFromBuffer = req.body.buffer.toString('utf-8');
        // split on the carriage return or newline
        var csvToArr = fileContentsFromBuffer.split(/\r|\n/);
        //  need to do for loop over array, split on comma and save
        var studentsArr = [];
        for (var i = 0; i < csvToArr.length; i++) {
            // regex to allow for commas inside ""
            let re = /[ ,]*"([^"]+)"|([^,]+)/g;
            let match;
            let dataArr = [];
            while (match = re.exec(csvToArr[i])) {
                let data = match[1] || match[2];
                dataArr.push(data);
            }
            let studentObj = {
                "id": i,
                "name": dataArr[0],
                "grade": dataArr[1],
                "focusArea": dataArr[2],
            }
            // create array of objects to be saved to database
            studentsArr.push(studentObj);
            if (i >= csvToArr.length-1 ){
                res.json(studentsArr);
            }

        }
 
    })

    app.use(function(req, res){
        // main entry point
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })

}
