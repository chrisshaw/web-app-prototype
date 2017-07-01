import uuid from 'uuid';
import {combineReducers } from 'redux';

const intialstate = {
  toggledrawer: false,
  grouplist: [],
  standardslist: [],
  subjectcontentlist: [],
  topiclist: [],
  grouptabs: [],
  selectedsubjectcontentlist: [],
  selectedstandardslist: [],
  selectedgrouplist: [],
  selectedtopiclist: [],
  initialSearchTerms: [],
  pathsrendered: false,
  paths: [],  
}

const loginintialstate = {
  loginerror: false,
}


//  The below are required and map to the components dispatcher
const mainReducer = (state={intialstate}, action) => {

    switch(action.type){    
        case 'VIEW_CSV_DATA':
            return Object.assign({},state, {csvdata: action.csvdata}); 
        case 'GET_FA':
            return Object.assign({},state, {focusArea: action.focusArea});
        case 'SELECTED_FA':
            return Object.assign({},state, {selectedFocusArea: action.selectedFocusArea});
        case 'UPDATE_CSV_NAME':
            return Object.assign({},state, {
                csvdata: state.csvdata.map(data => data.id === action.id ?
                    // transform the one with a matching id
                    { ...data, name: action.name } : 
                    // otherwise return original data
                    data
                ) 
            })   
        case 'UPDATE_CSV_GRADE':
            return Object.assign({},state, {
                csvdata: state.csvdata.map(data => data.id === action.id ?
                    // transform the one with a matching id
                    { ...data, grade: action.grade } : 
                    // otherwise return original data
                    data
                ) 
            })    
        case 'UPDATE_CSV_FA':
           if (state.csvdata){
                return Object.assign({},state, {        
                csvdata: state.csvdata.map(data => data.focusArea !== action.focusArea ?
                    // map all to new FA
                    { ...data, focusArea: action.focusArea } : 
                    // otherwise return original data
                    data
                ) 
            })   

           } else {
               return Object.assign({},state, {...state.csvdata})
           }
            
        case 'TOGGLE_DRAWER':
            return Object.assign({},state, {toggledrawer: action.toggledrawer});    
        case 'UPDATE_PATHS':
            return Object.assign({},state, {paths: action.paths});
        case 'RENDER_PATHS':
               console.log("in redux",action.pathsrendered )
            return Object.assign({},state, {pathsrendered: action.pathsrendered});
        case 'UPDATE_SEARCH_TERMS':
           // clear out old state if a new search
           if (!action.newSearch) {
                return Object.assign({},state, {initialSearchTerms: [...state.initialSearchTerms, action.initialSearchTerms]});
           } else if (action.newSearch) {
               // append serach items to state in a current search
                return Object.assign({},state, {initialSearchTerms: [action.initialSearchTerms]});
           }
        case 'UPDATE_GROUPS':
            //pulls for display in autopopulate dropdown to selected list for query
            // delete portion not currently in use - old code
            let newObj = {};
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
                if (newObj !== {}){
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

const appReducer = combineReducers({
    mainState : mainReducer,
    authState : authReducer,
})
// to handle clearing store on logout
const reducers = (state, action) => {

  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }
  console.log("staee", state);

  return appReducer(state, action)
}



export default reducers;

