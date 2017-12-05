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
    students: [],
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

export const getOptionsTable = state => state.optionsTable
export const getSelected = state => state.selected
export const getSelectedGrades = state => state.selected.grades
export const getSelectedCourses = state => state.selected.courses
export const getSelectedTopics = state => state.selected.topics
export const getSelectedSubjects = state => state.selected.subjects
export const getSelectedStandards = state => state.selected.standards

export const getFilteredOptionsTable = (state, optionList) => {
    const selected = getSelected(state)
    return getOptionsTable(state).filter( row => Object.entries(selected).every( ([key, values]) => {
        if (!values.length || key === optionList) return true
        if ( ['courses', 'students'].includes(key) ) {
            return values.some( object => checkObjectEquality(object, row[key]) )
        } else {
            return values.includes(row[key])
        }
    } ) )
}

export const getGradeOptions = state => Array.from(new Set(getFilteredOptionsTable(state, 'grades').map( option => option.grades )))
export const getCourseOptions = state => reduceToUniqueObjects(getFilteredOptionsTable(state, 'courses'), 'courses')
export const getTopicOptions = state => Array.from(new Set(getFilteredOptionsTable(state, 'topics').map( option => option.topics ))) 
export const getSubjectOptions = state => Array.from(new Set(getFilteredOptionsTable(state, 'subjects').map( option => option.subjects )))
export const getStandardsOptions = state => Array.from(new Set(getFilteredOptionsTable(state, 'standards').map( option => option.standards )))
export const getChosenStudents = state => reduceToUniqueObjects(getFilteredOptionsTable(state, 'students'), 'students')

export const getPotentialGrades = state => getGradeOptions(state).filter( option => !getSelectedGrades(state).includes(option)).sort( (a, b) => a - b )
export const getPotentialCourses = state => getCourseOptions(state).filter( option => !getSelectedCourses(state).includes(option._key) ).sort()
export const getPotentialTopics = state => getTopicOptions(state).filter( option => !getSelectedTopics(state).includes(option) ).sort( (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()) )
export const getPotentialSubjects = state => getSubjectOptions(state).filter( option => !getSelectedSubjects(state).includes(option) ).sort()
export const getPotentialStandards = state => getStandardsOptions(state).filter( option => !getSelectedStandards(state).includes(option) ).sort()