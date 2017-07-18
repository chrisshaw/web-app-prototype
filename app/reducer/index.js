import uuid from 'uuid';
import {combineReducers } from 'redux';

const intialstate = {
  toggledrawer: false,
  grouplist: [],
  standardslist: [],
  subjectcontentlist: [],
  topiclist: [],
  courselist: [],
  gradelist: [],
  grouptabs: [],
  selectedsubjectcontentlist: [],
  selectedstandardslist: [],
  selectedgrouplist: [],
  selectedcourselist: [],
  selectedgradelist: [],
  selectedtopiclist: [],
  initialSearchTerms: [],
  pathsrendered: false,
  pathbuilderview: false,
  paths: [],
  searching: false,  
}

const loginintialstate = {
  loginerror: false,
  signupfields:   {
        email: '', 
        password : '', 
        first: '',
        last: '',
        company: '',
        verify: '', 
        selectedrole:  'Please Select a Role',
        description: '',
        error: false, 
        errorMsg: ""
    }
}

const datainitialstate = {
    dataupload: "",
}


//  The below are required and map to the components dispatcher
const mainReducer = (state={intialstate}, action) => {

    switch(action.type){    
        case 'GET_FA':
            return Object.assign({},state, {focusArea: action.focusArea});
        case 'SELECTED_FA':
            return Object.assign({},state, {selectedFocusArea: action.selectedFocusArea});
        case 'BUILD_VIEW':
            return Object.assign({},state, {pathbuilderview: action.pathbuilderview}); 
        case 'UPDATE_PATHS':
            return Object.assign({},state, {paths: action.paths});
        // case 'RENDER_PATHS':
        //     return Object.assign({},state, {pathsrendered: action.pathsrendered});
        case 'SEARCHING_PATHS':
            return Object.assign({},state, {searching: action.searching});

        // ***** try to make UPDATE_* more dry as they essentially contain same codeE!!
        case 'UPDATE_GRADES':
            //pulls for display in autopopulate dropdown to selected list for query
            let gradeObj = -1;
            if (action.delete) {
                // use filter here to remove deleted group
                // remove from selectedgrouplist and add back to grouplist
                var newGroups = state.selectedgradelist.filter((group) => { 
                     
                    if (group._id === action.id){      
                        gradeObj = group;
                        return false;
                    }
                    return true;

                });    
                // in case of corrupt data 
                if (gradeObj !== -1){
                    // update
                    return Object.assign({},state, {selectedgradelist: newGroups, gradelist: [...state.gradelist, gradeObj] }); 
                } else {
                    // no change
                    return Object.assign({},state, {selectedgradelist: state.selectedgradelist, gradelist: state.gradelist }); 
                }
            } else if ((action.reset === true) &&  (action.delete === false)){
                console.log("in action.reset true", state.gradelist)
                return Object.assign({},state, {gradelist: action.gradelist, selectedgradelist: []});   
            } else if ((action.reset === false ) &&  (action.delete === false)) {
                // if not a reset action and there are no  items in the selected list
                // send back all grades
                console.log("state.selectedgradelis", state.selectedgradelist)
                if (state.selectedgradelist){
                     console.log("in action.reset false 1", state.gradelist)
                    return Object.assign({},state, {gradelist: state.gradelist}); 
                } else {
                     console.log("in action.reset false 2", action.gradelist)
                    return Object.assign({},state, {gradelist: action.gradelist}); 
                }
                
            } 
            // otherwise just return state
        case 'UPDATE_COURSES':  
                //pulls for display in autopopulate dropdown to selected list for query
                // delete portion not currently in use - old code
            let courseObj = -1;
            if (action.delete) {
                // use filter here to remove deleted group
                // remove from selectedgrouplist and add back to grouplist
                var newGroups = state.selectedcourselist.filter((group) => { 
                    
                    if (group._id === action.id){      
                        courseObj = group;
                        return false;
                    }
                    return true;

                });
                // in case of corrupt data 
                if (courseObj !== -1){
                    // update
                    return Object.assign({},state, {selectedcourselist: newGroups, courselist: [...state.courselist, courseObj] }); 
                } else {
                    // no change
                    return Object.assign({},state, {selectedcourselist: state.selectedcourselist, courselist: state.courselist }); 
                }
            } else if ((action.reset === true) &&  (action.delete === false)){
                return Object.assign({},state, {courselist: action.courselist, selectedcourselist: []});   
            } else if ((action.reset === false ) &&  (action.delete === false)) {
                // if not a reset action and there are no  items in the selected list
                // send back all grades
                if (state.selectedcourselist){
                    return Object.assign({},state, {courselist: state.courselist}); 
                } else {
                    return Object.assign({},state, {courselist: action.courselist}); 
                }
                
            } 
        // case 'UPDATE_GROUPS':
        //     //pulls for display in autopopulate dropdown to selected list for query
        //     // delete portion not currently in use - old code
        //     let newObj = -1;
        //     if (action.delete) {
        //         // use filter here to remove deleted group
        //         // remove from selectedgrouplist and add back to grouplist
        //         var newGroups = state.selectedgrouplist.filter((group) => {                   
        //             if (group._id === action.id){     
        //                 newObj = group;
        //                 return false;
        //             }
        //             return true;
        //         });           
        //         // in case of corrupt data 
        //         if (newObj !== -1){
        //             // update
        //             return Object.assign({},state, {selectedgrouplist: newGroups, grouplist: [...state.grouplist, newObj] }); 
        //         } else {
        //             // no change
        //             return Object.assign({},state, {selectedgrouplist: state.selectedgrouplist, grouplist: state.grouplist }); 
        //         }
        //     } 
        //     else {
        //         return Object.assign({},state, {grouplist: action.grouplist, selectedgrouplist: []});    
        //     }
        
         case 'UPDATE_TOPICS':
            //pulls for display in autopopulate dropdown to selected list for query
            // delete portion not currently in use - old code
            let newTopicObj = {};
            if (action.delete) {
                // use filter here to remove deleted group
                // remove from selectedgrouplist and add back to grouplist
                let newGroups = state.selectedtopiclist.filter((group) => {
                    if (group._id === action.id){
                        newTopicObj = group;
                        return false;
                    }
                    return true;

                });
                
                // in case of corrupt data 
                if (newTopicObj !== {}){
                    // update
                    return Object.assign({},state, {selectedtopiclist: newGroups, topiclist: [...state.topiclist, newTopicObj] }); 
                } else {
                    // no change
                    return Object.assign({},state, {selectedtopiclist: state.selectedtopiclist, topiclist: state.topiclist }); 
                }
             } else if ((action.reset === true) &&  (action.delete === false)){
                return Object.assign({},state, {topiclist: action.topiclist, selectedtopiclist: []});   
            } else if ((action.reset === false ) &&  (action.delete === false)) {
                // if not a reset action and there are no  items in the selected list
                // send back all grades
                if (state.selectedtopiclist){
                    return Object.assign({},state, {topiclist: state.topiclist}); 
                } else {
                    return Object.assign({},state, {topiclist: action.topiclist}); 
                }
                
            } 
        case 'UPDATE_SUBJECTS':
            //pulls for display in autopopulate dropdown to selected list for query
            // delete portion not currently in use - old code
            let newSubjectObj = {};
            if (action.delete) {        
                // use filter here to remove deleted group
                // remove from selectedgrouplist and add back to grouplist
                let newGroups = state.selectedsubjectcontentlist.filter((group) => {
                    if (group._id === action.id){
                        newSubjectObj = group;
                        return false;
                    }
                    return true;

                });
                // in case of corrupt data 
                if (newSubjectObj !== {}){
                    // update
                    return Object.assign({},state, {selectedsubjectcontentlist: newGroups, subjectcontentlist: [...state.subjectcontentlist, newSubjectObj] }); 
                } else {
                    // no change
                    return Object.assign({},state, {selectedsubjectcontentlist: state.selectedsubjectcontentlist, subjectcontentlist: state.subjectcontentlist }); 
                }
            } else if ((action.reset === true) &&  (action.delete === false)){
                return Object.assign({},state, {subjectcontentlist: action.subjectcontentlist, selectedsubjectcontentlist: []});   
            } else if ((action.reset === false ) &&  (action.delete === false)) {
                // if not a reset action and there are no  items in the selected list
                // send back all grades
                if (state.selectedsubjectcontentlist){
                    return Object.assign({},state, {subjectcontentlist: state.subjectcontentlist}); 
                } else {
                    return Object.assign({},state, {subjectcontentlist: action.subjectcontentlist}); 
                }           
            } 
        case 'UPDATE_STANDARDS':
            //pulls for display in autopopulate dropdown to selected list for query
            // delete portion not currently in use - old code
            let newStandardObj = {};
            if (action.delete) {             
                // use filter here to remove deleted group
                // remove from selectedgrouplist and add back to grouplist
                let newGroups = state.selectedstandardslist.filter((group) => {
                    if (group._id === action.id){
                        newStandardObj = group;
                        return false;
                    }
                    return true;

                });
                // in case of corrupt data 
                if (newSubjectObj !== {}){
                    // update
                    return Object.assign({},state, {selectedstandardslist: newGroups, standardslist: [...state.standardslist, newStandardObj] }); 
                } else {
                    // no change
                    return Object.assign({},state, {selectedstandardslist: state.selectedstandardslist, standardslist: state.standardslist }); 
                }
            } else if ((action.reset === true) &&  (action.delete === false)){
                return Object.assign({},state, {standardslist: action.standardslist, selectedstandardslist: []});   
            } else if ((action.reset === false ) &&  (action.delete === false)) {
                // if not a reset action and there are no  items in the selected list
                // send back all grades
                if (state.selectedstandardslist){
                    return Object.assign({},state, {standardslist: state.standardslist}); 
                } else {
                    return Object.assign({},state, {standardslist: action.standardslist}); 
                }           
            } 
        // ***** try to make UPDATE_SELECTED* more dry as they essentially contain same codeE!!
        case 'UPDATE_SELECTED_GRADES':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
            
            // decrease groups list and increase selected
            let newObj = {};
            let newGroups = state.gradelist.filter((group) => {                  
                if (group.name === action.item){
                    newObj = group;
                    return false;
                    }
                    return true;
                });
            if (newObj !== {}){
                // if new Obj is not empty make changes
                if (!state.selectedgradelist) {
                    // initially when array is empty do this
                    return Object.assign({selectedgradelist: []},state, {selectedgradelist:  [newObj],  gradelist: newGroups});    
                } else {     
                    // after there is at least one item do this
                    return Object.assign({selectedgradelist: []},state, {selectedgradelist:  [...state.selectedgradelist, newObj], gradelist: newGroups});    
                }
            }           
            
        case 'UPDATE_SELECTED_COURSES':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
                // decrease groups list and increase selected
            let newCourseObj = {};
            let newCourses = state.courselist.filter((group) => {                  
                if (group.name === action.item){
                    newCourseObj = group;
                    return false;
                    }
                    return true;
                });
            if (newCourseObj !== {}){
                // if new Obj is not empty make changes
                if (!state.selectedcourselist) {
                    // initially when array is empty do this
                    return Object.assign({selectedcourselist: []},state, {selectedcourselist:  [newCourseObj],  courselist: newCourses});    
                } else {     
                    // after there is at least one item do this
                    return Object.assign({selectedcourselist: []},state, {selectedcourselist:  [...state.selectedcourselist, newCourseObj], courselist: newCourses});    
                }
            }           
        case 'UPDATE_SELECTED_GROUPS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
                // decrease groups list and increase selected
                let newGroupObj = {};
                let newGroup = state.grouplist.filter((group) => {                  
                    if (group.name === action.item){
                        newGroupObj = group;
                        return false;
                        }
                        return true;
                    });
               if (newGroupObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedgrouplist) {
                        // initially when array is empty do this
                        return Object.assign({selectedgrouplist: []},state, {selectedgrouplist:  [newGroupObj],  grouplist: newGroup});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedgrouplist: []},state, {selectedgrouplist:  [...state.selectedgrouplist, newGroupObj], grouplist: newGroup});    
                    }
               }           
    
        case 'UPDATE_SELECTED_SUBJECTS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
            // let newSubjectItem ="";
            // if (action.delete) {
            //     // use filter here to remove deleted group name from selected list
            //     let newGroups = state.selectedsubjectcontentlist.filter((group) => {
            //         // add it back to the grouplist...
            //         if (group.name === action.item){
            //             return false;
            //         }
            //         return true;

            //     });
            //     return Object.assign({},state, {selectedsubjectcontentlist: newGroups});        
            // } 
            // else {
                // decrease groups list and increase selected
                let newSubObj = {};
                let newSubjectGroups = state.subjectcontentlist.filter((group) => {
                    // console.log(group.name, action.item);
                    if (group.name === action.item){
                        newSubObj = group;
                        return false;
                        }
                        return true;
                    });
               if (newSubObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedsubjectcontentlist) {
                        // initially when array is empty do this
                        return Object.assign({selectedsubjectcontentlist: []},state, {selectedsubjectcontentlist:  [newSubObj],  subjectcontentlist: newSubjectGroups});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedsubjectcontentlist: []},state, {selectedsubjectcontentlist:  [...state.selectedsubjectcontentlist, newSubObj], subjectcontentlist: newSubjectGroups});    
                    }
               }
                 
            
        case 'UPDATE_SELECTED_TOPICS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected lis
            // decrease groups list and increase selected
            let newTopObj = {};
            let newTopGroups = state.topiclist.filter((group) => {                  
            if (group.name === action.item){
                newTopObj = group;
                return false;
                }
                return true;
            });
            if (newTopObj !== {}){
                // if new Obj is not empty make changes
                if (!state.selectedtopiclist) {
                    // initially when array is empty do this
                    return Object.assign({selectedtopiclist: []},state, {selectedtopiclist:  [newTopObj],  topiclist: newTopGroups});    
                } else {     
                    // after there is at least one item do this
                    return Object.assign({selectedtopiclist: []},state, {selectedtopiclist:  [...state.selectedtopiclist, newTopObj], topiclist: newTopGroups});    
                }
            }
            
            case 'UPDATE_SELECTED_STANDARDS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected lis
            // decrease groups list and increase selected
            let newStdObj = {};
            let newStdGroups = state.standardslist.filter((group) => {              
            if (group.name === action.item){
                newStdObj = group;
                return false;
                }
                return true;

            });
            if (newStdObj !== {}){
                // if new Obj is not empty make changes
                if (!state.selectedstandardslist) {
                    // initially when array is empty do this
                    return Object.assign({selectedstandardslist: []},state, {selectedstandardslist:  [newStdObj],  standardslist: newStdGroups});    
                } else {     
                    // after there is at least one item do this
                    return Object.assign({selectedstandardslist: []},state, {selectedstandardslist:  [...state.selectedstandardslist, newStdObj], standardslist: newStdGroups});    
                }
            }
                   
    };    
    return state;
}

const authReducer = (state={loginintialstate}, action) => {
    // console.log("loginintialstate", loginintialstate);
    switch(action.type){    
        case 'LOGGED_IN':
            return Object.assign({},state, {loggedin: action.loggedin}); 
        case 'LOGIN_ERROR':
            return Object.assign({loginerror: false},state, {loginerror: action.loginerror, errormsg: action.errormsg }); 
        case 'GET_ROLES':
            return Object.assign({},state, {roles: action.roles});
        case 'SIGN_UP_STATUS':
            return Object.assign({signupok: false},state, {signupok: action.signupok, statusmsg: action.statusmsg }); 
        case 'SIGN_UP_FIELDS':
            return Object.assign(  {
                signupfields:  {
                        email: '', 
                        password : '', 
                        first: '',
                        last: '',
                        company: '',
                        verify: '', 
                        selectedrole:  'Please Select a Role',
                        description: '',
                        error: false, 
                        errorMsg: ""}
            },state, {signupfields: action.signupfields }); 
        case 'USER_PERMS':
            return Object.assign({perms: []},state, {perms: action.perms});
 };      
    return state;
}

const uploadReducer = (state={datainitialstate}, action) => {
    switch(action.type){  
        case 'VIEW_CSV_DATA':
            if (action.uploaderror) {
                return Object.assign({},state, {csvdata: action.csvdata, uploaderror: action.uploaderror}); 
            } else {
                return Object.assign({},state, {csvdata: action.csvdata, uploaderror: ""}); 
            }
        case 'CSV_SAVED':
            if (action.saveerror) {
                return Object.assign({},state, {datasaved: action.datasaved, saveerror: action.saveerror}); 
            } else {
                return Object.assign({},state, {datasaved: action.datasaved, saveerror: ""}); 
            }
    };      
    return state;
}

const appReducer = combineReducers({
    mainState : mainReducer,
    authState : authReducer,
    uploadState: uploadReducer,
})
// to handle clearing store on logout
const reducers = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
      console.log("logout")
    state = undefined
  }
  return appReducer(state, action)
}
export default reducers;

