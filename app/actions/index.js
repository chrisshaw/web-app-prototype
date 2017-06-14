exports.focusAreaResults = (area)=> {
  return {
      type: 'FOCUS_AREA',
      area,
    }
}

exports.noResults = (noResultsMsg)=> {
  return {
      type: 'NO_DATA_MSG',
      noResultsMsg,
    }
}

exports.viewDetailFocusArea = (fadetail) => {
    return {
      type: 'VIEW_DETAIL',
      fadetail,
    }
}


exports.viewUploadedCSVData = (csvdata) => {
    return {
      type: 'VIEW_CSV_DATA',
      csvdata,
    }
}

exports.updateCSVDataName = (name, id) => {
  console.log("action id, name", id, name);
    return {
      type: 'UPDATE_CSV_NAME',
      id: id,
      name,
    }
}

exports.updateCSVDataGrade = (grade, id) => {
  console.log("action id, name", id, grade);
    return {
      type: 'UPDATE_CSV_GRADE',
      id: id,
      grade,
    }
}

exports.updateCSVDataFA = (focusArea, id) => {
  console.log("action id, name", id, focusArea);
    return {
      type: 'UPDATE_CSV_FA',
      id: id,
      focusArea,
    }
}

exports.closePathBuilderDrawer = (toggledrawer) => {
    // action for main pathbuilder drawer - hide and show = false or true
    return {
      type: 'TOGGLE_DRAWER',
      toggledrawer,
    }
}

exports.updateGroupList = (deleteGroup, id, grouplist) => {
    return {
      type: 'UPDATE_GROUPS',
      delete: deleteGroup,
      id,
      grouplist,
    }
}
exports.saveSelectedGroup = (addOrRemove, item) => {
  console.log("addOrRemove, item", addOrRemove, item)
    return {
      type: 'UPDATE_SELECTED_GROUPS',
      delete: addOrRemove,
      item
    }
}
// exports.updateGroupTabs = (grouptabs) => {
//     return {
//       type: 'UPDATE_GROUP_TABS',
//       grouptabs,
//     }
// }



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
