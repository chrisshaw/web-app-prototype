import uuid from 'uuid';
import { combineReducers } from 'redux';
import update from 'immutability-helper';
import studentsTabReducer from './studentsTab';
import classReducer from './class';
import authReducer from './auth'
import teachersAndAdminsReducer from './teachersAndAdmins';
import flashMessageReducer from './flashMessage';
import queryBuilderReducer, {
    getPotentialGrades,
    getPotentialCourses,
    getPotentialStandards,
    getPotentialTopics,
    getPotentialSubjects,
    getSelectedGrades,
    getSelectedCourses,
    getSelectedStandards,
    getSelectedSubjects,
    getSelectedTopics,
    getChosenStudents
} from './querybuilder'
import pathViewerReducer, { 
    getLoaderState,
    getPathCount,
    getCurrentPath,
    getStudentGroups,
    getCurrentStudentGroup,
    getPathIndex,
    getFocusAreaLoaderStatus,
    getRelatedProjectsLoaderStatus,
    getFocusArea,
    getRelatedProjects,
    getPaths,
    getDetailType,
    getPotentialPeerTeachers,
    getTopic,
    getDetailFocusArea
 } from './pathviewer'

export const globalGetPotentialGrades = state => getPotentialGrades(state.queryBuilder)
export const globalGetPotentialCourses = state => getPotentialCourses(state.queryBuilder)
export const globalGetPotentialTopics = state => getPotentialTopics(state.queryBuilder)
export const globalGetPotentialSubjects = state => getPotentialSubjects(state.queryBuilder)
export const globalGetPotentialStandards = state => getPotentialStandards(state.queryBuilder)
export const globalGetSelectedGrades = state => getSelectedGrades(state.queryBuilder)
export const globalGetSelectedCourses = state => getSelectedCourses(state.queryBuilder)
export const globalGetSelectedTopics = state => getSelectedTopics(state.queryBuilder)
export const globalGetSelectedSubjects = state => getSelectedSubjects(state.queryBuilder)
export const globalGetSelectedStandards = state => getSelectedStandards(state.queryBuilder)
export const globalGetChosenStudents = state => getChosenStudents(state.queryBuilder)
export const globalGetLoaderState = state => getLoaderState(state.pathViewer)
export const globalGetPathCount = state => getPathCount(state.pathViewer)
export const globalGetPathIndex = state => getPathIndex(state.pathViewer)
export const globalGetPaths = state => getPaths(state.pathViewer)
export const globalGetCurrentPath = state => getCurrentPath(state.pathViewer)
export const globalGetStudentGroups = state => getStudentGroups(state.pathViewer)
export const globalGetCurrentStudentGroup = state => getCurrentStudentGroup(state.pathViewer)
export const globalGetFocusAreaLoaderStatus = state => getFocusAreaLoaderStatus(state.pathViewer)
export const globalGetRelatedProjectsLoaderStatus = state => getRelatedProjectsLoaderStatus(state.pathViewer)
export const globalGetFocusArea = state => getFocusArea(state.pathViewer)
export const globalGetDetailFocusArea =state => getDetailFocusArea(state.pathViewer)
export const globalGetTopic = state => getTopic(state.pathViewer)
export const globalGetRelatedProjects = state => getRelatedProjects(state.pathViewer)
export const globalGetDetailType = state => getDetailType(state.pathViewer)
export const globalGetPotentialPeerTeachers = state => getPotentialPeerTeachers(state.pathViewer)

const appReducer = combineReducers({
    pathViewer: pathViewerReducer,
    authState : authReducer,
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

