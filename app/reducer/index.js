import uuid from 'uuid';
import { combineReducers } from 'redux';
import update from 'immutability-helper';
import studentsTabReducer from './studentsTab';
import classReducer from './class';
import teachersAndAdminsReducer from './teachersAndAdmins';
import flashMessageReducer from './flashMessage';

const intialState = {
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
  currentFocusArea: {},
  isFocusAreaInfoFetching: false,
  focusAreaInfoError: {},
  currentPathRelatedProjects: {},
  isRelatedProjectsFetching: false,
  relatedProjectsError: {},
  pathsrendered: false,
  pathbuilderview: false,
  paths: [],
  disabled: true,
  searching: false,  
  changed: 0,
}

const loginInitialState = {
    loggedIn: false,
    permissions: [],
    loginError: false,
    signupFields: {
        email: '', 
        password : '', 
        first: '',
        last: '',
        company: '',
        verify: '', 
        selectedRole: 'Please Select a Role',
        description: '',
        error: false, 
        errorMsg: ""
    }
}

const statusInitialState = {
    success: false,
    successMsg: ""
}

function updateSelected(action, state, list, selectedlist){
        // decrease groups list and increase selected
    // let newObj = {};
    // let newGroups = state[list].filter((group) => {                  
    //     if (group.name === action.item){
    //         newObj = group;
    //         return false;
    //         }
    //         return true;
    //     });
    // if (newObj !== {}){
    // if new Obj is not empty make changes
    if (!state[selectedlist]) {
        // initially when array is empty do this
        return Object.assign({[selectedlist]: []}, state, {[selectedlist]: [action.item]});    
    } 
    else {     
        // after there is at least one item do this
        return Object.assign({[selectedlist]: []}, state, {[selectedlist]: [...state[selectedlist], action.item]});    
    }
    // } 
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
            return Object.assign({},state, {[selectedlist]: newGroups }); 
        } else {
            // no change
            return Object.assign({},state, {[selectedlist]: state[selectedlist] }); 
        }
    } else if ((action.reset === true) &&  (action.delete === false)) {
        // console.log("in action.reset true", state.gradelist)
        return Object.assign({},state, {[list]: action.list, [selectedlist]: []});   
    } else if ((action.reset === false ) &&  (action.delete === false)) {
        // if not a reset action and there are no  items in the selected list
        // send back all grades
        // console.log("state.selectedgradelist", state[selectedlist])
        if (state[selectedlist]) {
            return Object.assign({}, state, {[list]:  state[list]}); 
        } else {
            return Object.assign({}, state, {[list]: action.list}); 
        }
    } 
}
            
//  The below are required and map to the components dispatcher
const mainReducer = (state = intialState, action) => {
    
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
        case 'REQUEST_FOCUS_AREA_INFO':
          return Object.assign({}, state, { isFocusAreaInfoFetching: true });
        case 'SUCCESS_FOCUS_AREA_INFO':
          return Object.assign({}, state, {
            isFocusAreaInfoFetching: false,
            currentFocusArea: action.focusArea,
          });
        case 'ERROR_FOCUS_AREA_INFO':
          return Object.assign({}, state, {
            isFocusAreaInfoFetching: false,
            focusAreaInfoError: action.error,
          });
        case 'REQUEST_PATH_RELATED_PROJECTS':
          return Object.assign({}, state, { isRelatedProjectsFetching: true });
        case 'SUCCESS_PATH_RELATED_PROJECTS':
          return Object.assign({}, state, {
            isRelatedProjectsFetching: false,
            currentPathRelatedProjects: action.relatedProjects,
          });
        case 'ERROR_PATH_RELATED_PROJECTS':
          return Object.assign({}, state, {
            isRelatedProjectsFetching: false,
            relatedProjectsError: action.error,
        });
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
            return Object.assign({}, state, { falist: action.falist })
        case 'SHOW_MORE_ROWS': 
            return Object.assign(
                {},
                state,
                { falist: update(
                    state.falist,
                    { 
                        [action.index]: {$set: action.newvalue}
                    }
                )}
            )
    };        
    return state;
}

const authReducer = (state = loginInitialState, action) => {

    switch(action.type){    
        case 'LOGGED_IN':
            return Object.assign( {}, state, {
                loggedIn: action.data.success,
                username: action.data.username,
                userId: action.data.id,
                permissions: action.data.permissions,
                role: action.data.role
            });
        case 'LOGIN_ERROR':
            return Object.assign( { loginError: false }, state, { loginError: action.loginError, errorMsg: action.errorMsg }); 
        case 'GET_ROLES':
            return Object.assign( {}, state, { roles: action.roles } );
        case 'SIGN_UP_STATUS':
            return Object.assign( { signupOk: false }, state, { signupOk: action.signupOk, statusMsg: action.statusMsg }); 
        case 'SIGN_UP_FIELDS':
            return Object.assign( {
                signupFields:  {
                    email: '', 
                    password : '', 
                    first: '',
                    last: '',
                    school: '',
                    verify: '', 
                    selectedRole:  'Please Select a Role',
                    description: '',
                    error: false, 
                    errorMsg: ""
                }
            }, state, { signupFields: action.signupFields }
        );
        
        // case 'USER_PERMS':
        //     return Object.assign({permissions: []},state, {});
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
    appState: appStatusReducer,
    studentsTab: studentsTabReducer,
    teachersAndAdmins: teachersAndAdminsReducer,
    flashMessage: flashMessageReducer,
    classState: classReducer,
})
// to handle clearing store on logout
const reducers = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }
  return appReducer(state, action)
}
export default reducers;

