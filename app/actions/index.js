const action = {

focusAreaResults: (area)=> {
  return {
      type: 'FOCUS_AREA',
      area,
    }
},

noResults: (noResultsMsg)=> {
  return {
      type: 'NO_DATA_MSG',
      noResultsMsg,
    }
},

viewDetailFocusArea : (fadetail) => {
    return {
      type: 'VIEW_DETAIL',
      fadetail,
    }
},


viewUploadedCSVData: (csvdata) => {
    return {
      type: 'VIEW_CSV_DATA',
      csvdata,
    }
},

updateCSVDataName: (name, id) => {
  // console.log("action id, name", id, name);
    return {
      type: 'UPDATE_CSV_NAME',
      id: id,
      name,
    }
},

updateCSVDataGrade: (grade, id) => {
  // console.log("action id, name", id, grade);
    return {
      type: 'UPDATE_CSV_GRADE',
      id: id,
      grade,
    }
},

updateCSVDataFA: (focusArea) => {
  // console.log("action id, name", id, focusArea);
    return {
      type: 'UPDATE_CSV_FA',
      focusArea,
    }
},
getFAList: (focusArea) => {
    // console.log("action id, name", id, focusArea);
    return {
      type: 'GET_FA',
      focusArea,
    }
},
saveSelectedFA: (selectedFocusArea) => {
    // console.log("action id, name", id, focusArea);
    return {
      type: 'SELECTED_FA',
      selectedFocusArea,
    }
},
closePathBuilderDrawer: (toggledrawer) => {
    // action for main pathbuilder drawer - hide and show = false or true
    return {
      type: 'TOGGLE_DRAWER',
      toggledrawer,
    }
},

updateGroupList: (deleteGroup, id, grouplist) => {
    return {
      type: 'UPDATE_GROUPS',
      delete: deleteGroup,
      id,
      grouplist,
    }
},

saveSelectedGroup : (addOrRemove, item) => {
    return {
      type: 'UPDATE_SELECTED_GROUPS',
      delete: addOrRemove,
      item
    }
},

updatePathList: (paths) => {
  return {
      type: 'UPDATE_PATHS',
      paths
    }

},
initialQueryData: (initialSearchTerms, newSearch) => {
  // console.log("in action", initialSearchTerms)
  // newSearch is a boolean - true of false.
  // will be true for every new search
  return {
      type: 'UPDATE_SEARCH_TERMS',
      initialSearchTerms,
      newSearch
    }

},
updateTopicList: (deleteGroup, id, topiclist) => {
   //pulls for display in autopopulate dropdown to selected list for query
  return {
      type: 'UPDATE_TOPICS',
      delete: deleteGroup,
      id,
      topiclist,
    }
},
saveSelectedTopics: (addOrRemove, item) => {
  //saves to selected list for query and in chips
    return {
      type: 'UPDATE_SELECTED_TOPICS',
      delete: addOrRemove,
      item
    }
},
updateSubjectContentList: (deleteGroup, id, subjectcontentlist) => {
   //pulls for display in autopopulate dropdown to selected list for query
    return {
      type: 'UPDATE_SUBJECTS',
      delete: deleteGroup,
      id,
      subjectcontentlist,
    }
},
saveSelectedSubjects: (addOrRemove, item) => {
  //saves to selected list for query and in chips
    return {
      type: 'UPDATE_SELECTED_SUBJECTS',
      delete: addOrRemove,
      item
    }
},
updateStandardsList: (deleteGroup, id, standardslist) => {
   //pulls for display in autopopulate dropdown to selected list for query
   console.log("in action", deleteGroup, id, standardslist)
    return {
      type: 'UPDATE_STANDARDS',
      delete: deleteGroup,
      id,
      standardslist,
    }
},
saveSelectedStandards: (addOrRemove, item) => {
  //saves to selected list for query and in chips
    return {
      type: 'UPDATE_SELECTED_STANDARDS',
      delete: addOrRemove,
      item
    }
},
// noPathList: (groupid, groupname) => {
//   //saves to selected list for query and in chips
//     return {
//       type: 'NO_DATA_FOR_GROUP',
//       groupid,
//       groupname
//     }
// }
}


module.exports = action;


// exports.updateCSVData = (csvdata[i].name) => {
//     return { 
//           [action.id]: {
//             name: {$set: action.payload}
//           }
// }


// case 'SOME_ACTION':
//   return update(state, { 
//     contents: { 
//       [action.id]: {
//         text: {$set: action.payload}
//       }
//     }
//   });
