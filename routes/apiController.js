
var Course = require('../models/course');
var db = require('../config/arangoConnection.js');
// allows query templates to be used - can pass in variables and reuse.
var aqlQuery = require('arangojs').aqlQuery;

module.exports = function(app){

    // create a new database
    // db.createDatabase('fiona_test').then(
    //     () => console.log('Database created'),
    //     err => console.error('Failed to create database:', err)
    // );

    db.useDatabase('fiona_test');
   
    // create handle to collection before we start using it
    var collection = db.collection('secondCollection');
    // then create collection before putting data into it
    // collection.create().then(
    //     () => console.log('Collection created'),
    //     err => console.error('Failed to create collection:', err)
    // );

    //  add a document
    var doc = {
        // _key: 'customKey', // can have custome or auto keys
        a: 'foo',
        b: 'bar',
        c: Date()
    };
    collection.save(doc).then(
        meta => console.log('Document saved:', meta._rev),
        err => console.error('Failed to save document:', err)
    );
    // update exisiting document
    // collection.update('customKey', {d: 'qux'}).then(
    //     meta => console.log('Document updated:', meta._rev),
    //     err => console.error('Failed to update document:', err)
    // );

    // fetch a document from this collection
    collection.document('customKey').then(
        doc => console.log('Document:', JSON.stringify(doc, null, 2)),
        err => console.error('Failed to fetch document:', err.message)
    );

    // simple query 
    // returns a cursor object 
    // Keep in mind that unlike arrays, cursors are depleted when you use them.
    // collection.all().then(
    //     cursor => cursor.map(doc => doc)
    //     ).then(
    //     doc => console.log('All data:', doc),
    //     err => console.error('Failed to fetch all documents:', err)
    // );
 
    db.query('FOR d IN secondCollection SORT d.value ASC RETURN d._key').then(
        cursor => cursor.all()
    ).then(
        keys => console.log('All keys:', keys.join(', ')),
        err => console.error('Failed to execute query:', err)
    );
    
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
 

    console.log("graph daa", db.listGraphs().then(
        results => console.log('Update complete: found graph', results),
        err => console.error('Update failed:', err))
        );
    // get request from client for grade
    app.get('/focusarea/:year', function(req, res){
        var year = parseInt(req.params.year); 
        // take what we need out 
        Course.find({'focusAreas.focusAreaInfos.courses.gradeLevel': year}).exec(function (err, course) {
            if (err) return console.log(err);
                console.log(course[0]);
                // for now send whole object ignoring actual year requested
                res.json(course[0]);
            })
    })



   
}
