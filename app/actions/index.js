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

