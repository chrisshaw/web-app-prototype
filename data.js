// this is when there is just one focus area in the input file 
// need to determine actual input object structure  - maybe array of objects
// also need to look at order of input object ////
var FocusAreaObj = {};
// initially just read in the data from file
var FocusAreas = require('./InputData/InputDataFile');
FocusAreaObj.grade = FocusAreas.focusAreaInfos[0].courses[0].gradeLevel;
FocusAreaObj.title = FocusAreas.playlists[0].title;
var objectiveArr = [];
for (var i = 0; i < FocusAreas.playlists[0].objectives.length; i++ ){
    // console.log(FocusAreas.playlists[0].objectives[i].title);
    objectiveArr.push(FocusAreas.playlists[0].objectives[i].title);
}
FocusAreaObj.objectives = objectiveArr;

module.exports = FocusAreaObj;