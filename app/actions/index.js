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
userSignUp: (signupok) => {
  return {
    type: 'SIGN_UP_STATUS',
    signupok
  }
},  
signUpFields: (signupfields) => {
  // console.log(signupfields);
   return {
     type: 'SIGN_UP_FIELDS',
     signupfields
   }
},
userLogout: () => {
  return {
      type: 'USER_LOGOUT',
    }
  },
  userPerms: (data) => {
    return {
      type: 'USER_PERMS',
      data
    }
  },
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
  searchPaths: (searching) => {
    return {
      type: 'SEARCHING_PATHS',
      searching,
    }
  },
  saveSelected : (item, type) => {
      return {
        type,
        item
      }
  },
  updatePathList: (paths) => {
    return {
        type: 'UPDATE_PATHS',
        paths
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
  }
}


module.exports = action;


