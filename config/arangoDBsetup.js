
// var Course = require('../models/course');
var db = require('./arangoConnection.js');
// allows query templates to be used - can pass in variables and reuse.
var aqlQuery = require('arangojs').aqlQuery;
var graph = require('arangojs').Graph;

// clear out old data
db.dropDatabase("sidekick").then(
    // recreate it
    () => {db.useDatabase('sidekick')}
)
// create handle to collection before we start using it
// vertices
var ngss = db.collection('ngss');
// edgesƒ
var subject = db.collection('subject');
var grade = db.collection('grade');
var isChildOf = db.collection('isChildOf');
var isPartOf = db.collection('isPartOf');
var hasChild = db.collection('hasChild');
var isAlignedTo = db.collection('isAlignedTo');

// then create collection before putting data into it
// do this in another file
if (!db.collection(ngss)){
    console.log("in here");
    ngss.create().then(
        () => console.log("collection created", info),
        err => console.log('Failed to create collection:', err)
    )
}
if (!db.collection(subject)){
    subject.create().then(
        () => console.log("collection created", info),
        err => console.log('Failed to create collection:', err)
    )
}
if (!db.collection(grade)){
    grade.create().then(
        () => console.log("collection created", info),
        err => console.log('Failed to create collection:', err)
    )
}
if (!db.collection(isChildOf)){
    isChildOf.create().then(
        () => console.log("collection created", info),
        err => console.log('Failed to create collection:', err)
    )
}
if (!db.collection(isPartOf)){
    isPartOf.create().then(
        () => console.log("collection created", info),
        err => console.log('Failed to create collection:', err)
    )
}
if (!db.collection(hasChild)){
    hasChild.create().then(
        () => console.log("collection created", info),
        err => console.log('Failed to create collection:', err)
    )
}
if (!db.collection(isAlignedTo)){
    isAlignedTo.create().then(
        () => console.log("collection created", info),
        err => console.log('Failed to create collection:', err)
    )
}

// module.exports = true;