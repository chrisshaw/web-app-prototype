import { combineReducers } from 'redux'
import { checkObjectEquality } from '../helper/utils'

import {
    QUERYBUILDER_FETCH_OPTIONS_TABLE,
    QUERYBUILDER_FETCH_OPTIONS_TABLE_FAILED,
    QUERYBUILDER_LOAD_OPTIONS_TABLE,
} from '../actions/pathbuilder/actionTypes'

const initialState = {
    queryBuilder: {
        optionsTable: [],
        selected: {
            courses: [],
            topics: [],
            subjects: [],
            standards: []
        },
        isLoading: false
    },
    pathViewer: {
        focusAreas: [],
        paths: []
    }
}

/*

QUERYBUILDER

*/
export const queryBuilderReducer = (state = initialState.queryBuilder, action) => {
    switch (action.type) {
        case QUERYBUILDER_FETCH_OPTIONS_TABLE:
            return { ...state, isLoading: true }
        case QUERYBUILDER_FETCH_OPTIONS_TABLE_FAILED:
            return { ...state, isLoading: false }
        case QUERYBUILDER_LOAD_OPTIONS_TABLE:
            return { ...state, options: action.payload.options }
        default:
            return state
    }
}

/* SELECTORS */
const reduceToUniqueObjects = (allOptions, propName) => {
    return allOptions.reduce( (uniqueOptions, currentOption) => {
        if (!uniqueOptions.some( uniqueOption => checkObjectEquality(uniqueOption[propName], currentOption[propName]) )) {
            uniqueOptions.push(currentOption)
        }
        return uniqueOptions
    }, [] )
}

export const getCourseOptions = state => reduceToUniqueObjects(state.optionsTable, 'course')
export const getTopicOptions = state => reduceToUniqueObjects(state.optionsTable, 'topic')
export const getSubjectOptions = state => reduceToUniqueObjects(state.optionsTable, 'subject')
export const getStandardOptions = state => reduceToUniqueObjects(state.optionsTable, 'standard')

export const getSelectedCourses = state => state.selected.courses.map( courseId => getCourseOptions(state).find( courseOption => courseOption[courseId] === courseId ) )
export const getSelectedTopics = state => state.selected.topics
export const getSelectedSubjects = state => state.selected.subjects
export const getSelectedStandards = state => state.selected.standards

export const getPotentialCourses = state => getCourseOptions(state).filter( option => !state.selected.courses.includes(option._key) )
export const getPotentialTopics = state => getTopicOptions(state).filter( option => !state.selected.topics.includes(option) )
export const getPotentialSubjects = state => getSubjectOptions(state).filter( option => !state.selected.subjects.includes(option) )
export const getPotentialStandards = state => getStandardsOptions(state).filter( option => !state.selected.standards.includes(option) )


/*

PATHVIEWER 

*/
export const pathViewerReducer = (state = initialState.pathViewer, action) => {

}

const pathbuilderReducer = combineReducers({
    queryBuilderReducer,
    pathViewerReducer
})

export default pathbuilderReducer