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
}

const loginintialstate = {
  loginerror: false,
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
        case 'RENDER_PATHS':
            return Object.assign({},state, {pathsrendered: action.pathsrendered});
        case 'UPDATE_GRADES':
            //pulls for display in autopopulate dropdown to selected list for query
            // delete portion not currently in use - old code
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
            } 
            else {
                return Object.assign({},state, {gradelist: action.gradelist, selectedgradelist: []});    
            }
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
                } 
                else {
                    return Object.assign({},state, {courselist: action.courselist, selectedcourselist: []});    
                }
        case 'UPDATE_GROUPS':
            //pulls for display in autopopulate dropdown to selected list for query
            // delete portion not currently in use - old code
            let newObj = -1;
            if (action.delete) {
                // use filter here to remove deleted group
                // remove from selectedgrouplist and add back to grouplist
                var newGroups = state.selectedgrouplist.filter((group) => {                   
                    if (group._id === action.id){     
                        newObj = group;
                        return false;
                    }
                    return true;
                });           
                // in case of corrupt data 
                if (newObj !== -1){
                    // update
                    return Object.assign({},state, {selectedgrouplist: newGroups, grouplist: [...state.grouplist, newObj] }); 
                } else {
                    // no change
                    return Object.assign({},state, {selectedgrouplist: state.selectedgrouplist, grouplist: state.grouplist }); 
                }
            } 
            else {
                return Object.assign({},state, {grouplist: action.grouplist, selectedgrouplist: []});    
            }
        
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
            } 
            else {
                return Object.assign({},state, {topiclist: action.topiclist, selectedtopiclist: []});    
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
            } 
            else {
                return Object.assign({},state, {subjectcontentlist: action.subjectcontentlist, selectedsubjectcontentlist: []});    
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
            } 
            else {
                return Object.assign({},state, {standardslist: action.standardslist, selectedstandardslist: []});    
            }
        case 'UPDATE_SELECTED_GRADES':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
            if (action.delete) {
                // use filter here to remove deleted group name from selected list
                let newGroups = state.selectedgradelist.filter((group) => {
                    // add it back to the grouplist...
                    if (group.name === action.item){
                        return false;
                    }
                    return true;
                });
                return Object.assign({},state, {selectedgradelist: newGroups});       
            } 
            else {
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
            } 
        case 'UPDATE_SELECTED_COURSES':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
            if (action.delete) {
                // use filter here to remove deleted group name from selected list
                let newGroups = state.selectedcourselist.filter((group) => {
                    // add it back to the grouplist...
                    if (group.name === action.item){
                        return false;
                    }
                    return true;

                });
                return Object.assign({},state, {selectedcourselist: newGroups}); 
            
            } 
            else {
                // decrease groups list and increase selected
                let newObj = {};
                let newGroups = state.courselist.filter((group) => {                  
                    if (group.name === action.item){
                        newObj = group;
                        return false;
                        }
                        return true;
                    });
               if (newObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedcourselist) {
                        // initially when array is empty do this
                        return Object.assign({selectedcourselist: []},state, {selectedcourselist:  [newObj],  courselist: newGroups});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedcourselist: []},state, {selectedcourselist:  [...state.selectedcourselist, newObj], courselist: newGroups});    
                    }
               }           
            } 
        case 'UPDATE_SELECTED_GROUPS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
            let newItem ="";
            if (action.delete) {
                // use filter here to remove deleted group name from selected list
                let newGroups = state.selectedgrouplist.filter((group) => {
                    // add it back to the grouplist...
                    if (group.name === action.item){
                        return false;
                    }
                    return true;

                });
                return Object.assign({},state, {selectedgrouplist: newGroups}); 
            
            } 
            else {
                // decrease groups list and increase selected
                let newObj = {};
                let newGroups = state.grouplist.filter((group) => {                  
                    if (group.name === action.item){
                        newObj = group;
                        return false;
                        }
                        return true;
                    });
               if (newObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedgrouplist) {
                        // initially when array is empty do this
                        return Object.assign({selectedgrouplist: []},state, {selectedgrouplist:  [newObj],  grouplist: newGroups});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedgrouplist: []},state, {selectedgrouplist:  [...state.selectedgrouplist, newObj], grouplist: newGroups});    
                    }
               }           
            } 
        case 'UPDATE_SELECTED_SUBJECTS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected list
            let newSubjectItem ="";
            if (action.delete) {
                // use filter here to remove deleted group name from selected list
                let newGroups = state.selectedsubjectcontentlist.filter((group) => {
                    // add it back to the grouplist...
                    if (group.name === action.item){
                        return false;
                    }
                    return true;

                });
                return Object.assign({},state, {selectedsubjectcontentlist: newGroups});        
            } 
            else {
                // decrease groups list and increase selected
                let newObj = {};
                let newGroups = state.subjectcontentlist.filter((group) => {
                    // console.log(group.name, action.item);
                    if (group.name === action.item){
                        newObj = group;
                        return false;
                        }
                        return true;
                    });
               if (newObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedsubjectcontentlist) {
                        // initially when array is empty do this
                        return Object.assign({selectedsubjectcontentlist: []},state, {selectedsubjectcontentlist:  [newObj],  subjectcontentlist: newGroups});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedsubjectcontentlist: []},state, {selectedsubjectcontentlist:  [...state.selectedsubjectcontentlist, newObj], subjectcontentlist: newGroups});    
                    }
               }
                 
            } 
        case 'UPDATE_SELECTED_TOPICS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected lis
            let newTopicItem ="";
            if (action.delete) {
                // use filter here to remove deleted group name from selected list
                var newGroups = state.selectedtopiclist.filter((group) => {
                    // add it back to the grouplist...
                    if (group.name === action.item){
                        return false;
                    }
                    return true;

                });
                return Object.assign({},state, {selectedtopiclist: newGroups}); 
            
            } 
            else {
                // decrease groups list and increase selected
                let newObj = {};
                let newGroups = state.topiclist.filter((group) => {                  
                if (group.name === action.item){
                    newObj = group;
                    return false;
                    }
                    return true;
                });
               if (newObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedtopiclist) {
                        // initially when array is empty do this
                        return Object.assign({selectedtopiclist: []},state, {selectedtopiclist:  [newObj],  topiclist: newGroups});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedtopiclist: []},state, {selectedtopiclist:  [...state.selectedtopiclist, newObj], topiclist: newGroups});    
                    }
               }
            }  
            case 'UPDATE_SELECTED_STANDARDS':
            // saves to selected list for query and in chips
            // see what action is being performed - delete or add to selected lis
            let newStandardItem ="";
            if (action.delete) {
                // use filter here to remove deleted group name from selected list
                let newGroups = state.selectedstandardslist.filter((group) => {
                    // add it back to the grouplist...
                    if (group.name === action.item){
                        return false;
                    }
                    return true;

                });
                return Object.assign({},state, {selectedstandardslist: newGroups}); 
            } 
            else {
                // decrease groups list and increase selected
                let newObj = {};
                let newGroups = state.standardslist.filter((group) => {              
                if (group.name === action.item){
                    newObj = group;
                    return false;
                    }
                    return true;

                });
               if (newObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedstandardslist) {
                        // initially when array is empty do this
                        return Object.assign({selectedstandardslist: []},state, {selectedstandardslist:  [newObj],  standardslist: newGroups});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedstandardslist: []},state, {selectedstandardslist:  [...state.selectedstandardslist, newObj], standardslist: newGroups});    
                    }
               }
            }          
    };    
    return state;
}

const authReducer = (state={loginintialstate}, action) => {
    switch(action.type){    
        case 'LOGGED_IN':
            return Object.assign({},state, {loggedin: action.loggedin}); 
        case 'LOGIN_ERROR':
            return Object.assign({loginerror: false},state, {loginerror: action.loginerror, errormsg: action.errormsg }); 
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
    state = undefined
  }
  return appReducer(state, action)
}
export default reducers;

