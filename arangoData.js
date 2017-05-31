
// var Course = require('../models/course');
var db = require('./config/arangoConnection.js');
// creates collections etc
// require('./config/arangoDBsetup.js');
// allows query templates to be used - can pass in variables and reuse.
var aqlQuery = require('arangojs').aqlQuery;
var graph = require('arangojs').Graph;
// var ngssInputDataObj = require('./InputData/NGSS.js');
var fs = require('fs');
var ngssInputDataObj = JSON.parse(fs.readFileSync('./InputData/NGSS.js', 'utf8'));


// var jsonNGSS = JSON.parse(ngssInputDataObj);
// console.log(obj)

// module.exports = function(app){

// create a new database
db.createDatabase('sidekick').then(
    () => {
        db.useDatabase('sidekick');
        // loop through each key value pair in object
        // then drill into value for a given key
        // console.log("##########")
       
    },
        
    err => console.error('Failed to create database:', err)
).then(
    () => {createAndPopulateGraph(), console.log("database created")}
)


function createAndPopulateGraph() {
 
    // comment out once created
    var ngss = db.collection('ngss');
    var css =  db.collection('css');
    var subject = db.collection('subject');
    var grade = db.collection('grade');
    // edges
    var isChildOf = db.edgeCollection('isChildOf');
    var isPartOf = db.edgeCollection('isPartOf');
    var hasChild = db.edgeCollection('hasChild');
    var isAlignedTo = db.edgeCollection('isAlignedTo');
    var achievedBefore = db.edgeCollection('achievedBefore');
    var achievedAfter = db.edgeCollection('achievedAfter');
    var isComprisedOf = db.edgeCollection('isComprisedOf');
  
    ngss.create().then(
        () => console.log("collection created"),
        err => console.log('Failed to create collection:', err)
    ).then(
        // only needed intially to create edges
        () => {
       
            css.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
            subject.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
            grade.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            );
            isChildOf.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            );
            isComprisedOf.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            );
            isPartOf.create().then(
            () => console.log("collection created"),
            err => console.log('Failed to create collection:', err)
            )
            hasChild.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
            isAlignedTo.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
            achievedBefore.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
            achievedAfter.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
        }
    ).then(
        () =>  { 
                var graph = db.graph('nss-graph');
                graph.create({
                    edgeDefinitions: [
                        {
                            collection: 'isChildOf',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },
                        {
                            collection: 'isPartOf',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },
                    {
                            collection: 'hasChild',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },
                        {
                            collection: 'isAlignedTo',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },
                        {
                            collection: 'isComprisedOf',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },
                        {
                            collection: 'achievedBefore',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },
                           {
                            collection: 'achievedAfter',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },

                    ]
                })
                .then(graph => {
                    // graph is a Graph instance 
                    // for more information see the Graph API below 
                // add vertices
                    // graph.addVertexCollection('nss');

                // add edges
                //  graph.add

            })
        }).then(
        () => {
            // pass 1 to populate nss vertices
            var count = 0;

            for (var key in ngssInputDataObj) {
                // console.log(count);
                var NSSResourceObj = {};
               
                // get the key 
                // remove the http uri address from the resource (standard)
                // split the string into an array and take last value from resulting array
                var standard = key.split(/[\s/]+/);
                // NSSResourceObj._key=standard[standard.length-1];
                NSSResourceObj._key=standard[standard.length-1];
                NSSResourceObj.name=standard[standard.length-1];
                // get the value of the key and then extract data from this
                var nestedValue = ngssInputDataObj[key];
                count++;
                // iterate over the object looking at each key value pair in detail
                for (var nestedkey in nestedValue) {
                   
                    // remove the http uri address from the resource (standard)
                    // split the string into an array and take last value from resulting array
                    var standard1 = nestedkey.split(/[\s/]+/);
                    // add to object in prepartion for storage in NSS collection
                    // var vertexFrom = "";
                    // var vertexTo = "";
                    // handle each key:value pair and any data multiples
                    // this loop handles the cases where there is array of multiple items in the value items
                    for (var j = 0; j < nestedValue[nestedkey].length; j++){
                         
                        // if the value is a uri - extract final value 
                        var temp = nestedValue[nestedkey][j]["value"];
                        var standard2 = temp.split(/[/]/);
                        // console.log(standard1[standard1.length-1], ":", standard2[standard2.length-1]);
                        if (standard1[standard1.length-1] === "hasChild") {
                            // nss/_key from parent - [hasChild] -> nss/_key to child
                            let vertexFrom = "ngss/"+NSSResourceObj._key;
                            let vertexTo = "ngss/"+standard2[standard2.length-1]; 
                            // console.log("From", vertexTo,"to", vertexFrom);
                            // db.hasChild.save(vertexFrom, vertexTo, {"a" : "b"});

                            hasChild.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            )
                            // console.log("From", vertexTo,"to", vertexFrom);
                         
                            // console.log(standard1[standard1.length-1] , ":", standard2[standard2.length-1] );
                        } 
                        // else if (standard1[standard1.length-1] === "isPartOf") {
                        //     // nss/_key from child - [isPartof] -> nss/_key to parent
                        //     var vertexFrom = 'nss/' +  NSSResourceObj._key;
                        //     var vertexTo = 'nss/' + standard2[standard2.length-1];
                        //     db.isPartOf.save(vertexFrom, vertexTo);
                        //     // console.log(standard1[standard1.length-1] , ":", standard2[standard2.length-1] );
                        // } 
                        else if (standard1[standard1.length-1] === "isChildOf") {
                            // ngss/_key from child - [isChildOf] -> ngss/_key to parent
                            let vertexFrom = 'ngss/' +  NSSResourceObj._key;
                            let vertexTo = 'ngss/' + standard2[standard2.length-1];
                            isChildOf.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            );
                            // console.log("From", vertexTo,"to", vertexFrom);
                        } 
                        // else if (standard1[standard1.length-1] === "subject") {
                        //     // console.log(standard1[standard1.length-1], ":", standard2[standard2.length-1] );
                        // } else if (standard1[standard1.length-1] === "educationLevel") {
                        //     // console.log( standard1[standard1.length-1] , ":", standard2[standard2.length-1] );
                        // }  
                        else if (standard1[standard1.length-1] === "comprisedOf") {       
                            // nss/_key from parent - [hasChild] -> nss/_key to child
                            let vertexFrom = 'ngss/' +  NSSResourceObj._key;
                            let vertexTo = 'ngss/' + standard2[standard2.length-1];
                            // in here need to determine order of children
                            isComprisedOf.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            )
                            // console.log("From", vertexTo,"to", vertexFrom);
                        }  
                        // add back later once css created
                        // else if (standard1[standard1.length-1] === "alignTo") {       
                        //     // nss/_key from  - [alignTo] -> css/_key to
                        //     let vertexFrom = 'ngss/' +  NSSResourceObj._key;
                        //     let vertexTo = 'css/' + standard2[standard2.length-1];
                        // //     // in here need to determine order of children
                        //     isAlignedTo.save({
                        //         _from: vertexFrom,
                        //         _to: vertexTo
                        //     }).then(
                        //         () => console.log("edge created"),
                        //         err => console.log('Failed to create edge :', err)
                        //     )
                        // //    console.log("From", vertexTo,"to", vertexFrom);
                        // //     // and back
                        // //      // nss/_key to  <- [alignTo] - css/_key from
                        //     vertexFrom = 'ngss/' +  NSSResourceObj._key;
                        //     vertexTo = 'css/' + standard2[standard2.length-1];
                        // //     // in here need to determine order of children
                        //     isAlignedTo.save({
                        //         _from: vertexFrom,
                        //         _to: vertexTo
                        //     }).then(
                        //         () => console.log("edge created"),
                        //         err => console.log('Failed to create edge :', err)
                        //     )
                        //     console.log("From", vertexTo,"to", vertexFrom);
                        // } 
                        
                        else {
                                // console.log( standard1[standard1.length-1] , ":", standard2[standard2.length-1] );
                            NSSResourceObj[standard1[standard1.length-1]] = standard2[standard2.length-1];
                            // console.log(standard1[standard1.length-1], ":", standard2[standard2.length-1] );
                        }
                        
                    }
                }
                console.log("count:", count);
                // save this object to the database in NGSS collection or vertex;
                // console.log(NSSResourceObj);
                ngss.save(NSSResourceObj).then(
                    () => console.log('Document saved:', count),
                    err => console.log('Failed to create collection:', err)
                )

            }
        }
    ).then(
        () => console.log("complete")
        



    )


}
  
   // second pass - look at has Child relations  and create achieve before



   // third pass - look at belongsTo relations and create achieve after



   



    // create a graph with hasChild relation
    // var g = graph._create('relations',
    //     [graph._relation('has_child', 'NGSS', 'NGSS')]
    //     [graph._relation('belongs_to', 'NGSS', 'NGSS')]
    // );









    //  add a document
    // var doc = {
    //     // _key: 'customKey', // can have custome or auto keys
    //     a: 'foo',
    //     b: 'bar',
    //     c: Date()
    // };
    // collection.save(doc).then(
    //     meta => console.log('Document saved:', meta._rev),
    //     err => console.error('Failed to save document:', err)
    // );
    // update exisiting document
    // collection.update('customKey', {d: 'qux'}).then(
    //     meta => console.log('Document updated:', meta._rev),
    //     err => console.error('Failed to update document:', err)
    // );

    // fetch a document from this collection
    // collection.document('customKey').then(
    //     doc => console.log('Document:', JSON.stringify(doc, null, 2)),
    //     err => console.error('Failed to fetch document:', err.message)
    // );

    // simple query 
    // returns a cursor object 
    // Keep in mind that unlike arrays, cursors are depleted when you use them.
    // collection.all().then(
    //     cursor => cursor.map(doc => doc)
    //     ).then(
    //     doc => console.log('All data:', doc),
    //     err => console.error('Failed to fetch all documents:', err)
    // );
 
    // db.query('FOR d IN secondCollection SORT d.value ASC RETURN d._key').then(
    //     cursor => cursor.all()
    // ).then(
    //     keys => console.log('All keys:', keys.join(', ')),
    //     err => console.error('Failed to execute query:', err)
    // );
    
    // with aql query



// db.query(aqlQuery`
//   FOR doc IN ${collection}
//   UPDATE doc WITH {
//     value: doc.value + 2
//   } IN ${collection}
//   RETURN {old: OLD.value, new: NEW.value}
// `).then(
//   cursor => cursor.map(doc => `${doc.old} => ${doc.new}`)
// ).then(
//   results => console.log('Update complete:', results.join(', ')),
//   err => console.error('Update failed:', err)
// );


// inserts new document with key and value - as many as currently in collection
// db.query(aqlQuery`
//   FOR doc IN ${collection}
//   LET value = 100 + doc.value
//   INSERT {
//     _key: CONCAT("new", doc._key),
//     value
//   } INTO ${collection}
//   RETURN NEW
// `).then(
//   cursor => cursor.map(doc => doc._key)
// ).then(
//   keys => console.log('Inserted documents:', keys.join(', ')),
//   err => console.error('Failed to insert:', err)
// );
 

    // console.log("graph daa", db.listGraphs().then(
    //     results => console.log('Update complete: found graph', results),
    //     err => console.error('Update failed:', err))
    //     );
    // // get request from client for grade
    // app.get('/focusarea/:year', function(req, res){
    //     var year = parseInt(req.params.year); 
    //     // take what we need out 
    //     Course.find({'focusAreas.focusAreaInfos.courses.gradeLevel': year}).exec(function (err, course) {
    //         if (err) return console.log(err);
    //             console.log(course[0]);
    //             // for now send whole object ignoring actual year requested
    //             res.json(course[0]);
    //         })
    // })



   
// }









