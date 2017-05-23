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