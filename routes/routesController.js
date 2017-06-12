
var path = require('path');
var Student = require('../models/student');

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
            console.log(i,csvToArr.length );
            if (i >= csvToArr.length-1 ){
                console.log(studentsArr);
                res.json(studentsArr);
            }

        }
 
        // send back array of data to be viewed / edited and then saved to database

        // var newStudent = new Student(studentObj);
        //     console.log(i, csvToArr.length-1 );
        //     newStudent.save(function (err, student) {
        //         if (err) return errCount++;
        //         // if no error then save results to resultsArr for display
        //             resultsArr.push(student);
        //         // if all the csv data has been saved then return to client
              
        //         // var returnDataObj = {
        //         //     data: resultsArr,
        //         //     err: errCount
        //         // }
        //         // if (i >= csvToArr.length ){

        //         //     console.log(returnDataObj);
        //         //     res.json(returnDataObj);
        //         // }
        //     });
        // if (errCount !== 0) {
        // }
        // query database and send back the data for display
       
    })

    app.use(function(req, res){
        // main entry point
        res.sendFile(path.join(__dirname, '/../public/index.html'));
    })

}
