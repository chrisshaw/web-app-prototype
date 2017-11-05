const action = {

userLogin: (data) => {
  return {
    type: 'LOGGED_IN',
    data
  }
},
userLoginError: (loginError, errorMsg) => {
  return {
    type: 'LOGIN_ERROR',
    loginError,
    errorMsg
  }
},
userSignUp: (signupok) => {
  return {
    type: 'SIGN_UP_STATUS',
    signupok
  }
},  
signUpFields: (signupFields) => {
  // console.log(signupFields);
   return {
     type: 'SIGN_UP_FIELDS',
     signupFields
   }
},
userLogout: () => {
  return {
      type: 'USER_LOGOUT',
    }
  },
  // userPerms: (data) => {
  //   return {
  //     type: 'USER_PERMS',
  //     data
  //   }
  // },
  setPage: (pathbuilderview) => {
    //  console.log("set page in action:", pathbuilderview)
    return {
      type: 'BUILD_VIEW',
      pathbuilderview
    }
  },
  // this action is called to display uploaded csv data - saves into this.props.csvdata
  viewUploadedCSVData: (csvdata, uploaderror) => {
      return {
        type: 'VIEW_CSV_DATA',
        csvdata,
        uploaderror
      }
  },
  returnUploadedStatus: (datasaved, saveerror) => {
      return {
        type: 'CSV_SAVED',
        datasaved,
        saveerror
      }
  },
  getRoles: (roles) => {
    return {
      type: 'GET_ROLES',
      roles,
    }
  },
  // searchPaths: (searching) => {
  //   return {
  //     type: 'SEARCHING_PATHS',
  //     searching,
  //   }
  // },
  focusAreas: (fa) => {
    return {
        type: 'GET_FA',
        fa
    }
  },
  selectedFA: (selectedfa) => {
    return {
        type: 'SELECTED_FA',
        selectedfa
    }
  },
  saveSelected : (item, type) => {
      return {
        type,
        item
      }
  },
  updatePathList: (paths, searching, disabled) => {
    return {
        type: 'UPDATE_PATHS',
        paths,
        searching,
        disabled,
      }
  },
  addFAKey: (fakey) => {
    // console.log("action am i being called?")
    return {
        type: 'ADD_FA_TO_PATH',
        fakey
      }
  },
  updateList: (reset, deleteGroup, id, type, list) => {
      return {
        type,
        reset,
        delete: deleteGroup,
        id,
        list,
      }
  },
  showMoreRows: (newvalue, index) => {
    return {
      type: "SHOW_MORE_ROWS",
      index,
      newvalue
    }
  },
  showInitialRows: (falist) => {
    return {
      type: "SHOW_INITIAL_ROWS",
      falist
    }
  },
  setSuccess: (success, successMsg) => {
    console.log("being called")
    return {
      type: "SET_SUCCESS_STATUS",
      success,
      successMsg
    }
  },
  setError: (error, errorMsg) => {
    return {
      type: "SET_ERROR_STATUS",
      error,
      errorMsg
    }
  }
}


module.exports = action;


