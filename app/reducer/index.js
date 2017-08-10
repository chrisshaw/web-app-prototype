import uuid from 'uuid';
import {combineReducers } from 'redux';
import update from 'immutability-helper';

const intialstate = {
    //realised that intialstate wasnt workginas it was nesetd {initialstate} below
    //commmented out any arrays for now but will go back later and fix
//   toggledrawer: false,
//   grouplist: [],
//   standardslist: [],
//   subjectcontentlist: [],
//   topiclist: [],
//   courselist: [],
//   gradelist: [],
//   grouptabs: [],
//   selectedsubjectcontentlist: [],
//   selectedstandardslist: [],
//   selectedgrouplist: [],
//   selectedcourselist: [],
//   selectedgradelist: [],
//   selectedtopiclist: [],
//   initialSearchTerms: [],
  falist: {},
  pathsrendered: false,
  pathbuilderview: false,
  paths: [],
  disabled: true,
  searching: false,  
  changed: 0,
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
const statusInitialState = {
    success: false,
    successMsg: ""
}
function updateSelected(action, state, list, selectedlist){
        // decrease groups list and increase selected
    let newObj = {};
    let newGroups = state[list].filter((group) => {                  
        if (group.name === action.item){
            newObj = group;
            return false;
            }
            return true;
        });
    if (newObj !== {}){
        // if new Obj is not empty make changes
        if (!state[selectedlist]) {
            // initially when array is empty do this
            return Object.assign({[selectedlist]: []},state, {[selectedlist]:  [newObj],  [list]: newGroups});    
        } else {     
            // after there is at least one item do this
            return Object.assign({[selectedlist]: []},state, {[selectedlist]:  [...state[selectedlist], newObj], [list]: newGroups});    
        }
    } 
}

function updateQueryList(action, state, list, selectedlist) {
    let newObj = -1;
    if (action.delete) {
        // use filter here to remove deleted group
        // remove from selectedgrouplist and add back to grouplist
        var newGroups = state[selectedlist].filter((group) => {      
            if (group._id === action.id){      
                newObj = group;
                return false;
            }
            return true;
        });    
        // in case of corrupt data 
        if (newObj !== -1){
            // update
            return Object.assign({},state, {[selectedlist]: newGroups, [list]: [... state[list], newObj] }); 
        } else {
            // no change
            return Object.assign({},state, {[selectedlist]: state[selectedlist], [list]: state[list] }); 
        }
    } else if ((action.reset === true) &&  (action.delete === false)){
        // console.log("in action.reset true", state.gradelist)
        return Object.assign({},state, {[list]: action.list, [selectedlist]: []});   
    } else if ((action.reset === false ) &&  (action.delete === false)) {
        // if not a reset action and there are no  items in the selected list
        // send back all grades
        console.log("state.selectedgradelist", state[selectedlist])
        if (state[selectedlist]){
            return Object.assign({}, state, {[list]:  state[list]}); 
        } else {
            return Object.assign({}, state, {[list]: action.list}); 
        }
    } 
}
            
//  The below are required and map to the components dispatcher
const mainReducer = (state=intialstate, action) => {
    
    switch(action.type){    
        // case 'GET_FA':
        //     return Object.assign({},state, {focusArea: action.focusArea});
        // case 'SELECTED_FA':
        //     return Object.assign({},state, {selectedFocusArea: action.selectedFocusArea});
        case 'BUILD_VIEW':
            return Object.assign({},state, {pathbuilderview: action.pathbuilderview}); 
        case 'ADD_FA_TO_PATH':
            return Object.assign({},state, {fakey: action.fakey}); 
        case 'GET_FA':
            return Object.assign({},state, {fa: action.fa}); 
        case 'SELECTED_FA':
            return Object.assign({},state, {selectedfa: action.selectedfa}); 
        case 'UPDATE_PATHS':
            // react not seeing changes to path array after reorder for dnd
            // a hack i know but trying to force update for dnd re-render...so i use a counter that will change on every path array update
            // will revisit to improve for now it works!
            // console.log("changed", state.changed)
            return Object.assign({disabled: true},state, {paths: action.paths, searching: action.searching, disabled: action.disabled, changed: state.changed + 1});
        case 'UPDATE_GRADES':
            //pulls for display in autopopulate dropdown to selected list for query
           return updateQueryList(action, state, 'gradelist', 'selectedgradelist');
            // otherwise just return state
        case 'UPDATE_COURSES':  
            //pulls for display in autopopulate dropdown to selected list for query
            return updateQueryList(action, state, 'courselist', 'selectedcourselist');
         case 'UPDATE_TOPICS':
            //pulls for display in autopopulate dropdown to selected list for query
            return updateQueryList(action, state, 'topiclist', 'selectedtopiclist');
        case 'UPDATE_SUBJECTS':
            //pulls for display in autopopulate dropdown to selected list for query
            return updateQueryList(action, state, 'subjectcontentlist', 'selectedsubjectcontentlist');
        case 'UPDATE_STANDARDS':
            //pulls for display in autopopulate dropdown to selected list for query
             return updateQueryList(action, state, 'standardslist', 'selectedstandardslist'); 
        case 'UPDATE_SELECTED_GRADES':
            // saves to selected list for query and in chips
            return updateSelected(action, state, 'gradelist', 'selectedgradelist');       
        case 'UPDATE_SELECTED_COURSES':
            // saves to selected list for query and in chips
            return updateSelected(action, state, 'courselist', 'selectedcourselist');   
        case 'UPDATE_SELECTED_GROUPS':
            // saves to selected list for query and in chips
            return updateSelected(action, state, 'grouplist', 'selectedgrouplist'); 
        case 'UPDATE_SELECTED_SUBJECTS':
            // saves to selected list for query and in chips
            return updateSelected(action, state, 'subjectcontentlist', 'selectedsubjectcontentlist'); 
        case 'UPDATE_SELECTED_TOPICS':
            // saves to selected list for query and in chips
            return updateSelected(action, state, 'topiclist', 'selectedtopiclist'); 
        case 'UPDATE_SELECTED_STANDARDS':
            // saves to selected list for query and in chips
            return updateSelected(action, state, 'standardslist', 'selectedstandardslist');  
        case 'SHOW_INITIAL_ROWS': 
            return Object.assign({},state, {falist: action.falist})
         case 'SHOW_MORE_ROWS': 
            return Object.assign({},state, {falist: update(state.falist,{ 
                  [action.index]: {$set: action.newvalue}
                })
            })
    };        
    return state;
}

const authReducer = (state=loginintialstate, action) => {
    // console.log("loginintialstate", loginintialstate);
    switch(action.type){    
        case 'LOGGED_IN':
            return Object.assign({},state, {loggedin: action.data.success, username:  action.data.username, perms: action.data.perms, role: action.data.role}); 
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
                        school: '',
                        verify: '', 
                        selectedrole:  'Please Select a Role',
                        description: '',
                        error: false, 
                        errorMsg: ""}
            },state, {signupfields: action.signupfields }); 
        // case 'USER_PERMS':
        //     return Object.assign({perms: []},state, {});
 };      
    return state;
}

const uploadReducer = (state=datainitialstate, action) => {
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

const appStatusReducer = (state=statusInitialState, action) => {
    switch(action.type){  
        case 'SET_SUCCESS_STATUS':
            return Object.assign({},state, {success: action.success, successMsg: action.successMsg});  
         case 'SET_ERROR_STATUS':
            return Object.assign({},state, {error: action.error, errorMsg: action.errorMsg});  
    };      
    return state;
}

const appReducer = combineReducers({
    mainState : mainReducer,
    authState : authReducer,
    uploadState: uploadReducer,
    appState: appStatusReducer,
})
// to handle clearing store on logout
const reducers = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }
  return appReducer(state, action)
}
export default reducers;

