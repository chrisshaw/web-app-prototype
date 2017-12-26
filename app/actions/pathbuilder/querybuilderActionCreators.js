import callApi from '../../helper/api'

import {
    QUERYBUILDER_FETCH_PATHS,
    QUERYBUILDER_SHOW_PATHS,
    QUERYBUILDER_FETCH_PATHS_FAILED,
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
    QUERYBUILDER_REMOVE_STANDARD
} from './actionTypes'

export const fetchOptionsTableForQueryBuilder = userKey => ({
    type: QUERYBUILDER_FETCH_OPTIONS_TABLE,
    payload: { userKey }
})

export const fetchOptionsTableForQueryBuilderFailed = err => ({
    type: QUERYBUILDER_FETCH_OPTIONS_TABLE_FAILED,
    payload: { err }
})

export const loadOptionsForQueryBuilder = optionsTable => ({
    type: QUERYBUILDER_LOAD_OPTIONS_TABLE,
    payload: { optionsTable }
})

export const tryFetchOptionsTableForQueryBuilder = userKey => async dispatch => {
    dispatch(fetchOptionsTableForQueryBuilder(userKey))
    try {
        const optionResponse = await callApi('get', `pathbuilder/${userKey}/options`)
        // I'll need to see the response first, but then we can add some error handling here.
        if (true) {
            const optionsTable = optionResponse.data.optionTable
            dispatch(loadOptionsForQueryBuilder(optionsTable))
        } else {
            throw new Error('Something went wrong.')
        }
    } catch (err) {
        console.log(err)
        dispatch(fetchOptionsTableForQueryBuilderFailed(err))            
    }
}

export const selectGradeInQueryBuilder = grade => ({
    type: QUERYBUILDER_SELECT_GRADE,
    payload: { value: grade }
})

export const removeGradeInQueryBuilder = grade => ({
    type: QUERYBUILDER_REMOVE_GRADE,
    payload: { value: grade }
})

export const updateGradeInQueryBuilder = ({ action, dataItem: grade }) => dispatch => {
    if (action === 'insert') {
        dispatch(selectGradeInQueryBuilder(grade))
    } else if (action === 'remove') {
        dispatch(removeGradeInQueryBuilder(grade))
    } else {
        throw new Error(`We got an event from a React Widget that we don't know how to handle`)
    }
}

export const selectCourseInQueryBuilder = course => ({
    type: QUERYBUILDER_SELECT_COURSE,
    payload: { value: course }
})

export const removeCourseInQueryBuilder = course => ({
    type: QUERYBUILDER_REMOVE_COURSE,
    payload: { value: course }
})

export const updateCourseInQueryBuilder = ({ action, dataItem: course }) => dispatch => {
    if (action === 'insert') {
        dispatch(selectCourseInQueryBuilder(course))
    } else if (action === 'remove') {
        dispatch(removeCourseInQueryBuilder(course))
    } else {
        throw new Error(`We got an event from a React Widget that we don't know how to handle`)
    }
}

export const selectTopicInQueryBuilder = topic => ({
    type: QUERYBUILDER_SELECT_TOPIC,
    payload: { value: topic }
})

export const removeTopicInQueryBuilder = topic => ({
    type: QUERYBUILDER_REMOVE_TOPIC,
    payload: { value: topic }
})

export const updateTopicInQueryBuilder = ({ action, dataItem: topic }) => dispatch => {
    if (action === 'insert') {
        dispatch(selectTopicInQueryBuilder(topic))
    } else if (action === 'remove') {
        dispatch(removeTopicInQueryBuilder(topic))
    } else {
        throw new Error(`We got an event from a React Widget that we don't know how to handle`)
    }
}

export const selectSubjectInQueryBuilder = subject => ({
    type: QUERYBUILDER_SELECT_SUBJECT,
    payload: { value: subject }
})

export const removeSubjectInQueryBuilder = subject => ({
    type: QUERYBUILDER_REMOVE_SUBJECT,
    payload: { value: subject }
})

export const updateSubjectInQueryBuilder = ({ action, dataItem: subject }) => dispatch => {
    if (action === 'insert') {
        dispatch(selectSubjectInQueryBuilder(subject))
    } else if (action === 'remove') {
        dispatch(removeSubjectInQueryBuilder(subject))
    } else {
        throw new Error(`We got an event from a React Widget that we don't know how to handle`)
    }
}

export const selectStandardInQueryBuilder = standard => ({
    type: QUERYBUILDER_SELECT_STANDARD,
    payload: { value: standard }
})

export const removeStandardInQueryBuilder = standard => ({
    type: QUERYBUILDER_REMOVE_STANDARD,
    payload: { value: standard }
})

export const updateStandardInQueryBuilder = ({ action, dataItem: standard }) => dispatch => {
    if (action === 'insert') {
        dispatch(selectStandardInQueryBuilder(standard))
    } else if (action === 'remove') {
        dispatch(removeStandardInQueryBuilder(standard))
    } else {
        throw new Error(`We got an event from a React Widget that we don't know how to handle`)
    }
}

export const fetchPathsWithQueryBuilder = query => ({
    type: QUERYBUILDER_FETCH_PATHS,
    payload: { query }
})

export const showPathsFromQueryBuilder = paths => ({
    type: QUERYBUILDER_SHOW_PATHS,
    payload: { paths }
})

export const fetchPathsWithQueryBuilderFailed = err => ({
    type: QUERYBUILDER_FETCH_PATHS_FAILED,
    payload: { err }
})

export const tryFetchPathsWithQueryBuilder = query => async dispatch => {
    dispatch(fetchPathsWithQueryBuilder(query))
    try {
        const pathResponse = await callApi('post', 'path/project', query)
        // Once we see the data, we can see what error handling we need.
        if (true) {

            if (pathResponse.data.entities && pathResponse.data.entities.projects) {
                let projects = pathResponse.data.entities.projects;
                for (let key in projects) {
                    let recommendations = [];
                    if (projects[key].fa && projects[key].fa.length > 0) {
                        projects[key].fa.forEach(item => {
                            recommendations.push({
                                id: item.split('_')[0],
                                recommendation: ''
                            });
                        });
                        projects[key].recommendations = recommendations;
                    }
                }
            }
            console.log('-- processed\n', pathResponse.data)

            const paths = pathResponse.data
            dispatch(showPathsFromQueryBuilder(paths))
        } else {
            throw new Error('Something went wrong.')
        }
    } catch (err) {
        console.log(err)
        dispatch(fetchPathsWithQueryBuilderFailed(err))
    }
}
