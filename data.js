//dummy input data
// var FocusAreaObj = {};
// initially just read in the data from file
var Course = require('./models/course');
var CourseObj = require('./InputData/InputDataFile.js');
console.log(CourseObj);
// lets dump this into a database as this makes it easier to search and create dummy data
var newCourse = new Course(CourseObj);
newCourse.save({}, function (err, course) {
  if (err) return console.log(err);
  console.log(";course", course)
})


