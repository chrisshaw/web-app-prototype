const action = {

userLogin: (loggedin) => {
  return {
    type: 'LOGGED_IN',
    loggedin
  }
},
userLoginError: (loginerror, errormsg) => {
  return {
    type: 'LOGIN_ERROR',
    loginerror,
    errormsg
  }
},
userLogout: () => {
  return {
      type: 'USER_LOGOUT',
    }
  },
setPage: (pathbuilderview) => {
   console.log("set page in action:", pathbuilderview)
  return {
    type: 'BUILD_VIEW',
    pathbuilderview
  }
},
// this action is called to display uploaded csv data - saves into this.props.csvdata
viewUploadedCSVData: (csvdata) => {
    return {
      type: 'VIEW_CSV_DATA',
      csvdata,
    }
},
returnUploadedStatus: (datasaved, error) => {
    return {
      type: 'CSV_SAVED',
      datasaved,
      error
    }
},
// updateCSVDataName: (name, id) => {
//     return {
//       type: 'UPDATE_CSV_NAME',
//       id: id,
//       name,
//     }
// },
// updateCSVDataGrade: (grade, id) => {
//     return {
//       type: 'UPDATE_CSV_GRADE',
//       id: id,
//       grade,
//     }
// },
// updateCSVDataFA: (focusArea) => {
//     return {
//       type: 'UPDATE_CSV_FA',
//       focusArea,
//     }
// },
// getFAList: (focusArea) => {
//     return {
//       type: 'GET_FA',
//       focusArea,
//     }
// },
// saveSelectedFA: (selectedFocusArea) => {
//     return {
//       type: 'SELECTED_FA',
//       selectedFocusArea,
//     }
// },
// closePathBuilderDrawer: (toggledrawer) => {
//     // action for main pathbuilder drawer - hide and show = false or true
//     return {
//       type: 'TOGGLE_DRAWER',
//       toggledrawer,
//     }
// },

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
// used to indicate if a path has been rendered in the Tabs
pathsRendered: (pathsrendered) => {
  return {
      type: 'RENDER_PATHS',
      pathsrendered
    }
},

// initialQueryData: (initialSearchTerms, newSearch) => {
//   // newSearch is a boolean - true of false.
//   // will be true for every new search
//   return {
//       type: 'UPDATE_SEARCH_TERMS',
//       initialSearchTerms,
//       newSearch
//     }

// },
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
}


module.exports = action;


