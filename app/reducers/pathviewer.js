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
    orderedPathIds: [],
    currentPathIndex: 0,
}

export const pathListReducer = (state = pathviewerInitialState, action) => {
    switch(action.type){    
        case QUERYBUILDER_SHOW_PATHS:
            return {
                ...state,
                orderedPathIds: action.payload.paths.result,
                // entities: action.payload.paths.entities
            }
        case PATHVIEWER_CHANGE_CURRENT_PATH:
            return { ...state, currentPathIndex: action.payload.index }
        default:
            return state
    }
}

const projectInitialState = {}

export const projectReducer = (state = projectInitialState, action) => {
    switch (action.type) {
        case QUERYBUILDER_SHOW_PATHS:
            return action.payload.paths.entities.projects
        case PATHVIEWER_REMOVE_FOCUS_AREA:
            return {
                ...state,
                [action.payload.projectId]: {
                    name: state[action.payload.projectId]['name'],
                    fa: state[action.payload.projectId]['fa'].filter( (focusAreaId, i) => i !== action.payload.focusAreaIndex )
                }
            }
        case PATHVIEWER_MOVE_UP_FOCUS_AREA:
            const upNewList = state[action.payload.projectId]['fa'].slice()
            const upFocusAreaId = upNewList.splice(action.payload.focusAreaIndex, 1)
            upNewList.splice(action.payload.focusAreaIndex - 1, 0, upFocusAreaId)
            return {
                ...state,
                [action.payload.projectId]: {
                    name: state[action.payload.projectId]['name'],
                    fa: upNewList
                }
            }
        case PATHVIEWER_MOVE_DOWN_FOCUS_AREA:
            const downNewList = state[action.payload.projectId]['fa'].slice()
            const downFocusAreaId = downNewList.splice(action.payload.focusAreaIndex, 1)
            downNewList.splice(action.payload.focusAreaIndex + 1, 0, downFocusAreaId)
            return {
                ...state,
                [action.payload.projectId]: {
                    name: state[action.payload.projectId]['name'],
                    fa: downNewList
                }
            }        
        case PATHVIEWER_ADD_FOCUS_AREA:
            const addNewList = state[action.payload.projectId]['fa'].slice()
            const addedFocusArea = action.payload.focusAreaId
            const addedFocusAreaId = `${addedFocusArea}_Added`
            addNewList.splice(action.payload.focusAreaIndex + 1, 0, addedFocusAreaId)
            return {
                ...state,
                [action.payload.projectId]: {
                    name: state[action.payload.projectId]['name'],
                    fa: addNewList
                }
            }
        default:
            return state
    }

}

const pathsInitialState = {}

const pathReducer = (state = pathsInitialState, action) => {
    switch (action.type) {
        case QUERYBUILDER_SHOW_PATHS:
            return action.payload.paths.entities.paths
        default:
            return state
    }
}

const relevanceInitialState = {}

const relevanceReducer = (state = relevanceInitialState, action) => {
    switch (action.type) {
        case QUERYBUILDER_SHOW_PATHS:
            return action.payload.paths.entities.relevantFocusAreas
        case PATHVIEWER_ADD_FOCUS_AREA:
            const focusAreaId = action.payload.focusAreaId
            const relevantFocusAreaId = `${focusAreaId}_Added`
            const relevantFocusArea = {
                _id: focusAreaId,
                relevance: 'Added'
            }
            return {
                ...state,
                [relevantFocusAreaId]: relevantFocusArea
            }
        default:
            return state
    }
}

const focusAreaInitialState = {}

const focusAreaReducer = (state = focusAreaInitialState, action) => {
    switch (action.type) {
        case PATHVIEWER_LOAD_FOCUS_AREA_OPTIONS:
            return action.payload.data.entities.focusAreas
        default:
            return state
    }
}

const courseInitialState = {}

const courseReducer = (state = courseInitialState, action) => {
    switch (action.type) {
        case PATHVIEWER_LOAD_FOCUS_AREA_OPTIONS:
            return action.payload.data.entities.courses
        default:
            return state
    }
}

const entityReducer = combineReducers({
    projects: projectReducer,
    paths: pathReducer,
    relevantFocusAreas: relevanceReducer,
    focusAreas: focusAreaReducer,
    courses: courseReducer
})

const pathViewerReducer = combineReducers({
    paths: pathListReducer,
    entities: entityReducer,
})

const optionsInitialState = []

const optionsReducer = (state = optionsInitialState, action) => {
    switch (action.type) {
        case PATHVIEWER_LOAD_FOCUS_AREA_OPTIONS:
            return action.payload.data.result
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
    pathViewer: pathViewerReducer,
    detailDrawer: detailReducer,
    focusAreaOptions: optionsReducer
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

export const getPathCollection = state => state.pathViewer.entities.paths
export const getPathIds = state => state.pathViewer.paths.orderedPathIds
export const getPathById = (state, id) => id && getPathCollection(state)[id]
export const getPaths = state => getPathIds(state).map( pathId => getPathById(state, pathId) )
export const getPathCount = state => getPathIds(state).length
export const getPathIndex = state => state.pathViewer.paths.currentPathIndex
export const getCurrentPath = state => {
    const currentPathId = getPathIds(state)[getPathIndex(state)]
    return getPathById(state, currentPathId)
}
export const getStudentGroups = state => getPaths(state).map( path => path.studentsOnPath.map( student => student.name ) )
export const getCurrentStudentGroup = state => getCurrentPath(state) && getCurrentPath(state).studentsOnPath.map( student => student.name )
export const getCurrentProjects = state => getCurrentPath(state) && getCurrentPath(state).projectsOnPath
export const getProjectCollection = state => state.pathViewer.entities.projects
export const getProjectById = (state, id) => getProjectCollection(state)[id]
export const getPathProjects = state => getCurrentPath(state).pathProject.map( projectId => getProjectById(state, id) )

export const getCourseCollection = state => state.pathViewer.entities.courses
export const getCourseById = (state, id) => getCourseCollection(state)[id]
export const getCourseName = (state, id) => getCourseById(state, id).name

export const getFocusAreaCollection = state => state.pathViewer.entities.focusAreas
export const getFocusAreaById = (state, id) => getFocusAreaCollection(state)[id]

export const getFocusAreaOptionIds = state => state.focusAreaOptions
export const getFocusAreaOptions = state => getFocusAreaOptionIds(state).map( focusAreaId => {
    const { _id, name, course, ...rest } = getFocusAreaById(state, focusAreaId)
    return { _id, name, course: getCourseName(state, course) }
} )

export const getRelevantFocusAreaCollection = state => state.pathViewer.entities.relevantFocusAreas
export const getRelevantFocusAreaById = (state, id) => getRelevantFocusAreaCollection(state)[id]
export const getFocusAreaWithRelevanceById = (state, id) => {
    const relevantFocusArea = getRelevantFocusAreaById(state, id)
    const { _id, _key, name, subject, grade, course, ...rest } = getFocusAreaById(state, relevantFocusArea._id)
    return { _id, _key, name, subject, grade, course: getCourseName(state, course), relevance: relevantFocusArea.relevance }
}

export const getDetailType = state => state.detailDrawer.detailType
export const getFocusAreaLoaderStatus = state => state.detailDrawer.isFocusAreaInfoFetching
export const getRelatedProjectsLoaderStatus = state => state.detailDrawer.isRelatedProjectsFetching
export const getFocusArea = state => state.detailDrawer.currentFocusArea
export const getDetailFocusArea = state => getFocusArea(state) && getFocusArea(state).focusArea
export const getTopic = state => state.detailDrawer.currentTopic
export const getRelatedProjects = state => state.detailDrawer.currentPathRelatedProjects
export const getPotentialPeerTeachers = state => findPotentialTeachers(getFocusArea(state), getPaths(state))