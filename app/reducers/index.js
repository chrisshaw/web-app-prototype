import uuid from 'uuid';
import { combineReducers } from 'redux';
import update from 'immutability-helper';
import studentsTabReducer from './studentsTab';
import classReducer from './class';
import authReducer from './auth'
import teachersAndAdminsReducer from './teachersAndAdmins';
import flashMessageReducer from './flashMessage';
import queryBuilderReducer, {
    getPotentialCourses,
    getPotentialStandards,
    getPotentialTopics,
    getPotentialSubjects,
    getSelectedCourses,
    getSelectedStandards,
    getSelectedSubjects,
    getSelectedTopics
} from './querybuilder'

const mainInitialState = {
    a: 'b'
}

const statusInitialState = {
    success: false,
    successMsg: ""
}
            
//  The below are required and map to the components dispatcher
const mainReducer = (state = mainInitialState, action) => {
    
    switch(action.type){    
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
    };        
    return state;
}

export const globalGetPotentialCourses = state => getPotentialCourses(state.queryBuilder)
export const globalGetPotentialTopics = state => getPotentialTopics(state.queryBuilder)
export const globalGetPotentialSubjects = state => getPotentialSubjects(state.queryBuilder)
export const globalGetPotentialStandards = state => getPotentialStandards(state.queryBuilder)
export const globalGetSelectedCourses = state => getSelectedCourses(state.queryBuilder)
export const globalGetSelectedTopics = state => getSelectedTopics(state.queryBuilder)
export const globalGetSelectedSubjects = state => getSelectedSubjects(state.queryBuilder)
export const globalGetSelectedStandards = state => getSelectedStandards(state.queryBuilder)

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
    queryBuilder: queryBuilderReducer
})
// to handle clearing store on logout
export default (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }
  return appReducer(state, action)
}

