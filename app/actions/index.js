exports.focusAreaResults = (area)=> {
  // console.log("action", text);
  return {
      type: 'FOCUS_AREA',
      area,
    }
}

exports.noResults = (noResultsMsg)=> {
  // console.log("action", text);
  return {
      type: 'NO_DATA_MSG',
      noResultsMsg,
    }
}


// exports.deleteTodo = (id)=> {
//   // console.log("action", text);
//   return {
//       type: 'DELETE_TODO',
//       id,
//     }
// }


// exports.searchQuery = (text) => {
//     return {
//       type: 'SEARCH_TEXT',
//       text,
//     }

// }