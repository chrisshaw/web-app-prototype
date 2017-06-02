var Database = require('arangojs').Database;
var db_login = 'root'; // no need to hide these as they are dummy local values
var db_pwd = 'sidekick'; // no need to hide these as they are dummy local values
var db_string = 'http://'+ db_login +':' + db_pwd + '@127.0.0.1:8529';
var db_url = process.env.ARANGO_URI || db_string;
db = new Database(db_url);
// creates collections etc
// allows query templates to be used - can pass in variables and reuse.
var aqlQuery = require('arangojs').aqlQuery;
var graph = require('arangojs').Graph;
var fs = require('fs');

// rename database from sidekick as required

db.useDatabase("sidekick");
var fa =  db.collection('focusarea');
fa.create().then(
    () => {FocusArea()},
    err => console.log('Failed to create collection:', err)
);


function FocusArea(){
    const readline = require('readline');
   

    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('./InputData/FocusAreas.csv')
    });

    lineReader.on('line', function (line) {
        let re = /[ ,]*"([^"]+)"|([^,]+)/g;
        let match;
        let i = 0;
        let previousLine = "";
        let dataArr = [];
        while (match = re.exec(line)) {
            if (line !== previousLine){
                // reset arr
                dataArr = [];
            }

            let data = match[1] || match[2];
            dataArr.push(data);
            // console.log(faObj);
            previousLine = line;
        }

        let faObj = {
        "subject": dataArr[0],
        "Grade": dataArr[1],
        "FocusArea": dataArr[2],
        "Objective 1": {
            "Description" : dataArr[3],
            "Standard" : dataArr[4]
        },
        "Objective 2": {
            "Description" : dataArr[5],
            "Standard" : dataArr[6]
        },
        "Objective 3": {
            "Description" : dataArr[3],
            "Standard" : dataArr[7]
        },
        "Objective 4": {
            "Description" : dataArr[8],
            "Standard" : dataArr[3]
        },
        "Objective 5": {
            "Description" : dataArr[9],
            "Standard" : dataArr[10]
        },
        "Type":  dataArr[11]
    }
    // console.log(faObj);
    // now save to the database
     fa.save(faObj).then(
                    () => console.log('Document saved:', count),
                    err => console.log('Failed to create collection:', err)
                )
       
       
    });

}




  
   






