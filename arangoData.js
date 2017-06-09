var db = require('./config/arangoConnection.js');
// creates collections etc
// allows query templates to be used - can pass in variables and reuse.
var aqlQuery = require('arangojs').aqlQuery;
var graph = require('arangojs').Graph;
var fs = require('fs');
var ngssInputDataObj = JSON.parse(fs.readFileSync('./InputData/NGSS.js', 'utf8'));
var cssInputDataObj = JSON.parse(fs.readFileSync('./InputData/CCSS-eng.js', 'utf8'));

// !!!!!!! Be CAREFUL -- this will clear out database and recreate all of it!!!!!!
// comment out lines 14 - 32 if the database exists and you dont want do drop it and recreate from scratch
fa.drop();
db.dropDatabase("sidekick").then(
    // create a new database
    db.createDatabase('sidekick').then(
        () => {  db.useDatabase('sidekick');
        },
            
        err => console.error('Failed to create database:', err)
    )
    .then(
        // css-eng data
        // not very DRY - lost of repitition!
        () => {createAndPopulateCSSGraph()}
    )
    .then(
        // ngss data
        // not very DRY - lost of repitition!
        () => { createAndPopulateGraph()}
    )

)



// main function that does data parsing and population
function createAndPopulateGraph() {
    // comment out once created
    var ngss = db.collection('ngss');
    var css =  db.collection('css');
    // edges
    var achievedAfter = db.edgeCollection('achievedAfter');
    var isPartOf = db.edgeCollection('isPartOf');
    var achievedBefore = db.edgeCollection('achievedBefore');
    var isAlignedTo = db.edgeCollection('isAlignedTo');
    var isComprisedOf = db.edgeCollection('isComprisedOf');
  
    ngss.create().then(
        () => console.log("collection created"),
        err => console.log('Failed to create collection:', err)
    ).then(
        // only needed intially to create edges
        () => {
    
            achievedAfter.create().then(
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
            achievedBefore.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
            isAlignedTo.create().then(
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
                            collection: 'achievedAfter',
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
            // var count = 0;
            for (var key in ngssInputDataObj) {
                var NSSResourceObj = {};
                // get the key 
                // remove the http uri address from the resource (standard)
                // split the string into an array and take last value from resulting array
                var standard = key.split(/[\s/]+/);
                NSSResourceObj._key=standard[standard.length-1];
                NSSResourceObj.name=standard[standard.length-1];
               console.log("in here", NSSResourceObj);
                // get the value of the key and then extract data from this
                var nestedValue = ngssInputDataObj[key];
                NSSResourceObj["grade"] = '';
                // iterate over the object looking at each key value pair in detail
                for (var nestedkey in nestedValue) {
                    // remove the http uri address from the resource (standard)
                    // split the string into an array and take last value from resulting array
                    var standard1 = nestedkey.split(/[\s/]+/);
                    // add to object in prepartion for storage in NSS collection
                    // handle each key:value pair and any data multiples
                    // this loop handles the cases where there is array of multiple items in the value items
                    let obj = {};
                  

                    for (var j = 0; j < nestedValue[nestedkey].length; j++){
                         
                        // if the value is a uri - extract final value 
                        let temp = nestedValue[nestedkey][j]["value"];
                        let standard2 = temp.split(/[/]/);
                        // console.log(standard1[standard1.length-1], ":", standard2[standard2.length-1]);
                        if (standard1[standard1.length-1] === "hasChild") {
                            // nss/_key from parent - [hasChild] -> nss/_key to child
                            let vertexFrom = "ngss/"+NSSResourceObj._key;
                            let vertexTo = "ngss/"+standard2[standard2.length-1]; 
                            // save this to the edge collection --- achievedBefore
                            achievedBefore.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            )
                        } 
                        else if (standard1[standard1.length-1] === "isChildOf") {
                            // ngss/_key from child - [isChildOf] -> ngss/_key to parent
                            let vertexFrom = 'ngss/' +  NSSResourceObj._key;
                            let vertexTo = 'ngss/' + standard2[standard2.length-1];
                            achievedAfter.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            );
                        } 
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
                        else if (standard1[standard1.length-1] === "educationLevel") {
                            
                            NSSResourceObj.grade =  NSSResourceObj.grade+ ',' +  standard2[standard2.length-1]  ;     
                            console.log(NSSResourceObj.grade );             
                            // cssResourceObj[standard1[standard1.length-1]] = tempVar +  standard2[standard2.length-1];
               
                        } 
                
                        else if (standard1[standard1.length-1] === "alignTo") {  
                            ///uri of align to matches field core#exactMatch in CSS
                            // first work out what the CSS key is
                            console.log(standard1[standard1.length-1], ":",  nestedValue[nestedkey][j]["value"]);
                            obj[j] =  nestedValue[nestedkey][j]["value"];
                            NSSResourceObj[standard1[standard1.length-1]] = obj;

                            // need to create the edge
                            // console.log( NSSResourceObj[standard1[standard1.length-1]])
                            // db.query('FOR s IN css-eng FILTER s.statementNotation=${standard2[standard2.length-1]} RETURN s._key').then(
                            // cursor => cursor.all()
                            // ).then(
                            // keys => console.log('All keys:', keys.join(', ')),
                            // err => console.error('Failed to execute query:', err)
                            // );
                            // nss/_key from  - [alignTo] -> css/_key to
                        //     let vertexFrom = 'ngss/' +  NSSResourceObj._key;
                        //     let vertexTo = 'css/' + standard2[standard2.length-1];
                        //     // in here need to determine order of children
                        //     isAlignedTo.save({
                        //         _from: vertexFrom,
                        //         _to: vertexTo
                        //     }).then(
                        //         () => console.log("edge created"),
                        //         err => console.log('Failed to create edge :', err)
                        //     )
                        //     // nss/_key to  <- [alignTo] - css/_key from
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
                        } 
                        
                        else {    
                            // for everything else
                            NSSResourceObj[standard1[standard1.length-1]] = standard2[standard2.length-1]; 
                        }
                        
                    }
                }
                // save this object to the database in NGSS collection or vertex;
                console.log("NSSResourceObj", NSSResourceObj);
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
  

// main function that does data parsing and population
function createAndPopulateCSSGraph() {
    // comment out once created
    // nodes
    var css =  db.collection('css-eng');
    // edges
    var achievedAfterCSS = db.edgeCollection('achievedAfterCSS');
    var achievedBeforeCSS = db.edgeCollection('achievedBeforeCSS');
    var isAlignedTo = db.edgeCollection('isAlignedTo');
    var isComprisedOfCSS = db.edgeCollection('isComprisedOfCSS');


    css.create().then(
        () => console.log("collection created"),
        err => console.log('Failed to create collection:', err)
    ).then(
        // only needed intially to create edges
        () => {
            isComprisedOfCSS.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            );
            achievedBeforeCSS.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            ); 
            achievedAfterCSS.create().then(
                () => console.log("collection created"),
                err => console.log('Failed to create collection:', err)
            )
        }
    ).then(
        () =>  { 
                var cssenggraph = db.graph('css-graph');
                cssenggraph.create({
                    edgeDefinitions: [
                        {
                            collection: 'achievedAfterCSS',
                            from: [
                                'css-eng'
                            ],
                            to: [
                                'css-eng'
                            ]
                        },
                        {
                            collection: 'achievedBeforeCSS',
                            from: [
                                'css-eng'
                            ],
                            to: [
                                'css-eng'
                            ]
                        },
                        {
                            collection: 'isComprisedOfCSS',
                            from: [
                                'css-eng'
                            ],
                            to: [
                                'css-eng'
                            ]
                        }


                    ]
                })
        }).then(
        () => {
            // initial pass to populate nss vertices -- excluding alignedToStandard
            var count = 0;
            // console.log(cssInputDataObj);
            for (var key in cssInputDataObj) {
                let cssResourceObj = {};
                cssResourceObj["grade"] = '';
                // get the key 
                // remove the http uri address from the resource (standard)
                // split the string into an array and take last value from resulting array
                let standard = key.split(/[\s/]+/);
                cssResourceObj._key=standard[standard.length-1];
                cssResourceObj.name=standard[standard.length-1];
                console.log(cssResourceObj._key);
                // get the value of the key and then extract data from this
                let nestedValue = cssInputDataObj[key];
                count++;
                // iterate over the object looking at each key value pair in detail

                for (var nestedkey in nestedValue) {
                    // console.log("nestedValue");
                    // console.log(nestedValue);
                    // remove the http uri address from the resource (standard)
                    // split the string into an array and take last value from resulting array
                    let standard1 = nestedkey.split(/[\s/]+/);
                    // add to object in prepartion for storage in NSS collection
                    // handle each key:value pair and any data multiples
                    let obj = {};
                    // this loop handles the cases where there is array of multiple items in the value items
                    for (var j = 0; j < nestedValue[nestedkey].length; j++){
                        // console.log(nestedValue[nestedkey][j]["value"]);
                        // if the value is a uri - extract final value 
                        let temp = nestedValue[nestedkey][j]["value"];
                        let standard2 = temp.split(/[/]/);
                        // console.log(standard1[standard1.length-1], ":", standard2[standard2.length-1]);
                        if (standard1[standard1.length-1] === "hasChild") {
                            // nss/_key from parent - [hasChild] -> nss/_key to child
                            let vertexFrom = "css-eng/"+cssResourceObj._key;
                            let vertexTo = "css-eng/"+standard2[standard2.length-1]; 
                            // save this to the edge collection --- achievedBefore
                            achievedBeforeCSS.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            )
                        } 
                        else if (standard1[standard1.length-1] === "isChildOf") {
                            // ngss/_key from child - [isChildOf] -> ngss/_key to parent
                            let vertexFrom = 'css-eng/' +  cssResourceObj._key;
                            let vertexTo = 'css-eng/' + standard2[standard2.length-1];
                            achievedAfterCSS.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            );
                        } 
                        else if (standard1[standard1.length-1] === "core#exactMatch") {
                            // ngss/_key from child - [isChildOf] -> ngss/_key to parent
                            ///uri of align to matches field core#exactMatch in CSS
                            // first work out what the CSS key is
                            obj[j] =  nestedValue[nestedkey][j]["value"];
                            // console.log(standard1[standard1.length-1], ":",  nestedValue[nestedkey][j]["value"]);
                            cssResourceObj[standard1[standard1.length-1]] = obj;
                           
                        } 
                        else if (standard1[standard1.length-1] === "educationLevel") {   
                            
                            cssResourceObj.grade =  standard2[standard2.length-1] + ',' + cssResourceObj.grade;     
                            console.log(cssResourceObj.grade );             
                        }  
                        else if (standard1[standard1.length-1] === "comprisedOf") {       
                            // nss/_key from parent - [hasChild] -> nss/_key to child
                            let vertexFrom = 'css-eng/' +  cssResourceObj._key;
                            let vertexTo = 'css-eng/' + standard2[standard2.length-1];
                            // in here need to determine order of children
                            isComprisedOfCSS.save({
                                _from: vertexFrom,
                                _to: vertexTo
                            }).then(
                                () => console.log("edge created"),
                                err => console.log('Failed to create edge :', err)
                            )
                        }      
                        else {                        
                            // for everything else
                            cssResourceObj[standard1[standard1.length-1]] = standard2[standard2.length-1];
                        }
                        
                    }
                }
                // save this object to the database in NGSS collection or vertex;
                css.save(cssResourceObj).then(
                    () => console.log('Document saved:', count),
                    err => console.log('Failed to create collection:', err)
                )

            }
        }
    ).then(
        () => console.log("first pass complete")
    )
}
  
   






