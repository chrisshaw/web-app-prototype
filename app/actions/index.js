exports.focusAreaResults = (area)=> {
  // console.log("action", text);
  return {
      type: 'FOCUS_AREA',
      area,
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