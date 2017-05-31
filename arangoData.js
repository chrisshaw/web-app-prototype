var db = require('./config/arangoConnection.js');
// creates collections etc
// allows query templates to be used - can pass in variables and reuse.
var aqlQuery = require('arangojs').aqlQuery;
var graph = require('arangojs').Graph;
var fs = require('fs');
var ngssInputDataObj = JSON.parse(fs.readFileSync('./InputData/NGSS.js', 'utf8'));

 
// !!!!!!! Be CAREFUL -- this will clear out database and recreate all of it!!!!!!
// comment out lines 14 - 32 if the database exists and you dont want do drop it and recreate from scratch

db.dropDatabase("sidekick").then(
    // create a new database
    db.createDatabase('sidekick').then(
        () => {
            db.useDatabase('sidekick');
        },
            
        err => console.error('Failed to create database:', err)
    ).then(
        () => {createAndPopulateGraph(), console.log("database created")}
    )
)

// main function that does data parsing and population
function createAndPopulateGraph() {
    // comment out once created
    var ngss = db.collection('ngss');
    var css =  db.collection('css');
    var subject = db.collection('subject');
    var grade = db.collection('grade');
    // edges
    var isChildOf = db.edgeCollection('achievedAfter');
    var isPartOf = db.edgeCollection('isPartOf');
    var hasChild = db.edgeCollection('achievedBefore');
    var isAlignedTo = db.edgeCollection('isAlignedTo');
    // var achievedBefore = db.edgeCollection('achievedBefore');
    // var achievedAfter = db.edgeCollection('achievedAfter');
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
            // achievedBefore.create().then(
            //     () => console.log("collection created"),
            //     err => console.log('Failed to create collection:', err)
            // )
            // achievedAfter.create().then(
            //     () => console.log("collection created"),
            //     err => console.log('Failed to create collection:', err)
            // )
        }
    ).then(
        () =>  { 
                var graph = db.graph('nss-graph');
                graph.create({
                    edgeDefinitions: [
                        {
                            collection: 'achievedAfter',
                            from: [
                                'ngss'
                            ],
                            to: [
                                'ngss'
                            ]
                        },
                        // {
                        //     collection: 'isPartOf',
                        //     from: [
                        //         'ngss'
                        //     ],
                        //     to: [
                        //         'ngss'
                        //     ]
                        // },
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
                        }


                    ]
                })
        }).then(
        () => {
            // initial pass to populate nss vertices -- excluding alignedToStandard
            var count = 0;
            for (var key in ngssInputDataObj) {
                var NSSResourceObj = {};
                // get the key 
                // remove the http uri address from the resource (standard)
                // split the string into an array and take last value from resulting array
                var standard = key.split(/[\s/]+/);
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
                            // save this to the edge collection --- achievedBefore
                            hasChild.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            )
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
                        } 
                        // perhaps filter on subject and educationLevel / Grade or create new Edges?
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
                            NSSResourceObj[standard1[standard1.length-1]] = standard2[standard2.length-1];
                        }
                        
                    }
                }
                // save this object to the database in NGSS collection or vertex;
                ngss.save(NSSResourceObj).then(
                    () => console.log('Document saved:', count),
                    err => console.log('Failed to create collection:', err)
                )

            }
        }
    ).then(
        () => console.log("first pass complete")
    )
}
  
   








