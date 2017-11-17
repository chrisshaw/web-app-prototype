import { combineReducers } from 'redux'
import { checkObjectEquality } from '../helper/utils'

import {
    QUERYBUILDER_FETCH_OPTIONS_TABLE,
    QUERYBUILDER_FETCH_OPTIONS_TABLE_FAILED,
    QUERYBUILDER_LOAD_OPTIONS_TABLE,
    QUERYBUILDER_SELECT_GRADE,
    QUERYBUILDER_SELECT_COURSE,
    QUERYBUILDER_SELECT_TOPIC,
    QUERYBUILDER_SELECT_SUBJECT,
    QUERYBUILDER_SELECT_STANDARD,
    QUERYBUILDER_REMOVE_GRADE,
    QUERYBUILDER_REMOVE_COURSE,
    QUERYBUILDER_REMOVE_TOPIC,
    QUERYBUILDER_REMOVE_SUBJECT,
    QUERYBUILDER_REMOVE_STANDARD,
} from '../actions/pathbuilder/actionTypes'

/*

REDUCERS

*/
const initialLoaderState = false

export const loaderReducer = (state = initialLoaderState, action) => {
    switch(action.type) {
        case QUERYBUILDER_FETCH_OPTIONS_TABLE:
            return true
        case QUERYBUILDER_LOAD_OPTIONS_TABLE:
        case QUERYBUILDER_FETCH_OPTIONS_TABLE_FAILED:
            return false
        default:
            return state
    }
}

const initialOptionsState = []

export const optionsTableReducer = (state = initialOptionsState, action) => {
    switch (action.type) {
        case QUERYBUILDER_LOAD_OPTIONS_TABLE:
            return action.payload.optionsTable
        default:
            return state
    }
}

const initialSelectedState = {
    grades: [],
    courses: [],
    topics: [],
    subjects: [],
    standards: []
}

export const selectedReducer = (state = initialSelectedState, action) => {
    switch (action.type) {
        case QUERYBUILDER_SELECT_GRADE:
            return { ...state, grades: [...state.grades, action.payload.value] }
        case QUERYBUILDER_REMOVE_GRADE:
            return { ...state, grades: state.grades.filter( grade => grade !== action.payload.value ) }
        case QUERYBUILDER_SELECT_COURSE:
            return { ...state, courses: [...state.courses, action.payload.value] }
        case QUERYBUILDER_REMOVE_COURSE:
            return { ...state, courses: state.courses.filter( course => !checkObjectEquality(course, action.payload.value) ) }
        case QUERYBUILDER_SELECT_TOPIC:
            return { ...state, topics: [...state.topics, action.payload.value] }
        case QUERYBUILDER_REMOVE_TOPIC:
            return { ...state, topics: state.topics.filter( topic => topic !== action.payload.value ) }
        case QUERYBUILDER_SELECT_SUBJECT:
            return { ...state, subjects: [...state.subjects, action.payload.value] }
        case QUERYBUILDER_REMOVE_SUBJECT:
            return { ...state, subjects: state.subjects.filter( subject => subject !== action.payload.value ) }
        case QUERYBUILDER_SELECT_STANDARD:
            return { ...state, standards: [...state.standards, action.payload.value] }
        case QUERYBUILDER_REMOVE_STANDARD:
            return { ...state, standards: state.standards.filter( standard => standard !== action.payload.value ) }
        default:
            return state
    }
}

export default combineReducers({
    isLoading: loaderReducer,
    optionsTable: optionsTableReducer,
    selected: selectedReducer
})


/*

SELECTORS

*/
const reduceToUniqueObjects = (allOptions, propName) => {
    return allOptions.reduce( (uniqueOptions, currentOption) => {
        if (!uniqueOptions.length || !uniqueOptions.some( uniqueOption => {
            return checkObjectEquality(uniqueOption, currentOption[propName])
        } )) {
            uniqueOptions.push(currentOption[propName])
        }
        return uniqueOptions
    }, [] )
}

export const getCourseOptions = state => reduceToUniqueObjects(state.optionsTable, 'course')
export const getTopicOptions = state => Array.from(new Set(state.optionsTable.map( option => option.topic )))
export const getSubjectOptions = state => Array.from(new Set(state.optionsTable.map( option => option.subject )))
export const getStandardsOptions = state => Array.from(new Set(state.optionsTable.map( option => option.standard )))

export const getSelectedCourses = state => state.selected.courses
export const getSelectedTopics = state => state.selected.topics
export const getSelectedSubjects = state => state.selected.subjects
export const getSelectedStandards = state => state.selected.standards

export const getPotentialCourses = state => getCourseOptions(state).filter( option => !state.selected.courses.includes(option._key) )
export const getPotentialTopics = state => getTopicOptions(state).filter( option => !state.selected.topics.includes(option) )
export const getPotentialSubjects = state => getSubjectOptions(state).filter( option => !state.selected.subjects.includes(option) )
export const getPotentialStandards = state => getStandardsOptions(state).filter( option => !state.selected.standards.includes(option) )