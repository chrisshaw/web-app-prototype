import { combineReducers } from 'redux'

import {
    QUERYBUILDER_FETCH_PATHS,
    QUERYBUILDER_SHOW_PATHS,
    QUERYBUILDER_FETCH_PATHS_FAILED,
    PATHVIEWER_MOVE_UP_FOCUS_AREA,
    PATHVIEWER_MOVE_DOWN_FOCUS_AREA,
    PATHVIEWER_ADD_FOCUS_AREA,
    PATHVIEWER_REMOVE_FOCUS_AREA,
    PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS,
    PATHVIEWER_LOAD_FOCUS_AREA_OPTIONS,
    PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS_FAILED,
    PATHVIEWER_INSERT_FOCUS_AREA,
    REQUEST_FOCUS_AREA_INFO,
    SUCCESS_FOCUS_AREA_INFO,
    ERROR_FOCUS_AREA_INFO,
    REQUEST_PATH_RELATED_PROJECTS,
    SUCCESS_PATH_RELATED_PROJECTS,
    ERROR_PATH_RELATED_PROJECTS,
    PATHVIEWER_CHANGE_CURRENT_PATH,
    PATHVIEWER_CLEAR_DETAILS
} from '../actions/pathbuilder/actionTypes'


const loaderInitialState = false

export const loaderReducer = (state = loaderInitialState, action) => {
    switch (action.type) {
        case QUERYBUILDER_FETCH_PATHS:
            return true
        case QUERYBUILDER_SHOW_PATHS:
        case QUERYBUILDER_FETCH_PATHS_FAILED:
            return false
        default:
            return state
    }
}
            
const pathviewerInitialState = {
    all: [],
    current: 0,
    focusAreaOptions: []
}

export const pathViewerReducer = (state = pathviewerInitialState, action) => {
    
    switch(action.type){    
        case QUERYBUILDER_SHOW_PATHS:
            return { ...state, all: action.payload.paths }
        case PATHVIEWER_CHANGE_CURRENT_PATH:
            return { ...state, current: action.payload.index }
        case PATHVIEWER_MOVE_UP_FOCUS_AREA:
        case PATHVIEWER_MOVE_DOWN_FOCUS_AREA:
        case PATHVIEWER_REMOVE_FOCUS_AREA:
        case PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS:
        case PATHVIEWER_LOAD_FOCUS_AREA_OPTIONS:
        case PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS_FAILED:
        case PATHVIEWER_ADD_FOCUS_AREA:
        case PATHVIEWER_INSERT_FOCUS_AREA:
        default:
            return state
    }
}

const detailInitialState = {
    detailType: null,
    isFocusAreaInfoFetching: false,
    currentFocusArea: null,
    currentTopic: null,
    isRelatedProjectsFetching: false,
    currentPathRelatedProjects: null
}

export const detailReducer = (state = detailInitialState, action) => {
    switch (action.type) {
        case REQUEST_FOCUS_AREA_INFO:
            return {
                ...state,
                isFocusAreaInfoFetching: true,
                isRelatedProjectsFetching: false,
                currentPathRelatedProjects: null
            };
        case SUCCESS_FOCUS_AREA_INFO:
            return {
                ...state,
                detailType: 'focus area',
                isFocusAreaInfoFetching: false,
                currentFocusArea: action.focusArea.pop(),
            };
        case ERROR_FOCUS_AREA_INFO:
            return {
                ...state,
                isFocusAreaInfoFetching: false,
                focusAreaInfoError: action.error
            };
        case REQUEST_PATH_RELATED_PROJECTS:
            return {
                ...state,
                currentTopic: action.topic,
                isRelatedProjectsFetching: true,
                isFocusAreaInfoFetching: false,
                currentFocusArea: null
            };
        case SUCCESS_PATH_RELATED_PROJECTS:
            return {
                ...state,
                detailType: 'related projects',
                isRelatedProjectsFetching: false,
                currentPathRelatedProjects: action.relatedProjects
            };
        case ERROR_PATH_RELATED_PROJECTS:
            return {
                ...state,
                isRelatedProjectsFetching: false,
                relatedProjectsError: action.error
            };
        case PATHVIEWER_CLEAR_DETAILS:
            return {
                ...state,
                detailType: null,
                currentFocusArea: null,
                currentPathRelatedProjects: null
            }
        default:
            return state
    }
}

export default combineReducers({
    pathsLoading: loaderReducer,
    paths: pathViewerReducer,
    detailDrawer: detailReducer
})

/*

SELECTORS

*/

// Helpers
const findPotentialTeachers = (focusArea, paths) => {
    if (!focusArea) return null
    let potentialTeachers = [];
    for (let path of paths) {
        for (let studentOnPath of path.studentsOnPath) {
            for (let masteredFocusArea of studentOnPath.masteredFocusAreas) {
                if (masteredFocusArea._id === focusArea._id) {
                    potentialTeachers.push({
                        _id: studentOnPath._id,
                        name: studentOnPath.name,
                        lastMastered: daysSince(masteredFocusArea.lastUpdated),
                    });
                }
            }
        }
    }
    return potentialTeachers;
}

const daysSince = lastUpdated => {
    const now =+ new Date();
    const diffSec = (now - lastUpdated) / 1000;
    return Math.floor(diffSec / 86400);
}

// Selectors
export const getLoaderState = state => state.pathsLoading
export const getPaths = state => state.paths.all
export const getPathCount = state => getPaths(state).length
export const getPathIndex = state => state.paths.current
export const getCurrentPath = state => getPaths(state)[getPathIndex(state)].projectPath
export const getStudentGroups = state => getPaths(state).map( path => path.studentsOnPath.map( student => student.name ) )
export const getCurrentStudentGroup = state => getStudentGroups(state)[getPathIndex(state)]

export const getDetailType = state => state.detailDrawer.detailType
export const getFocusAreaLoaderStatus = state => state.detailDrawer.isFocusAreaInfoFetching
export const getRelatedProjectsLoaderStatus = state => state.detailDrawer.isRelatedProjectsFetching
export const getFocusArea = state => state.detailDrawer.currentFocusArea
export const getDetailFocusArea = state => getFocusArea(state).focusArea
export const getTopic = state => state.detailDrawer.currentTopic
export const getRelatedProjects = state => state.detailDrawer.currentPathRelatedProjects
export const getPotentialPeerTeachers = state => findPotentialTeachers(getFocusArea(state), getPaths(state))