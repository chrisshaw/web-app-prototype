import callApi from '../../helper/api'

import {
    QUERYBUILDER_FETCH_PATHS,
    QUERYBUILDER_SHOW_PATHS,
    QUERYBUILDER_FETCH_PATHS_FAILED,
    QUERYBUILDER_FETCH_OPTIONS_TABLE,
    QUERYBUILDER_FETCH_OPTIONS_TABLE_FAILED,
    QUERYBUILDER_LOAD_OPTIONS_TABLE
} from './actionTypes'

export const fetchOptionsTableForQueryBuilder = userKey => ({
    type: QUERYBUILDER_FETCH_OPTIONS_TABLE,
    payload: { userKey }
})

export const fetchOptionsTableForQueryBuilderFailed = err => ({
    type: QUERYBUILDER_FETCH_OPTIONS_TABLE_FAILED,
    payload: { err }
})

export const loadOptionsForQueryBuilder = options => ({
    type: QUERYBUILDER_LOAD_OPTIONS_TABLE,
    payload: { options }
})

export const tryFetchOptionsTableForQueryBuilder = userKey => async dispatch => {
    return dispatch => {
        dispatch(fetchOptionsTableForQueryBuilder(userKey))
        try {
            const optionResponse = await callApi('get', `pathbuilder/${userKey}/options`)
            console.log(optionResponse)
            // I'll need to see the response first, but then we can add some error handling here.
            if (true) {
                const options = optionResponse.data
                dispatch(loadOptionsForQueryBuilder(options))
            } else {
                throw new Error('Something went wrong.')
            }
        } catch (err) {
            console.log(err)
            dispatch(fetchOptionsTableForQueryBuilderFailed(err))            
        }
    }
}

export const showPathsFromQueryBuilder = paths => ({
    type: QUERYBUILDER_SHOW_PATHS,
    payload: { paths }
})

export const fetchPathsWithQueryBuilder = query => ({
    type: QUERYBUILDER_FETCH_PATHS,
    payload: { query }
})

export const fetchPathsWithQueryBuilderFailed = err => ({
    type: QUERYBUILDER_FETCH_PATHS_FAILED,
    payload: { err }
})

export const tryFetchPathsWithQueryBuilder = query => async dispatch => {
    return dispatch => {
        dispatch(fetchPathsWithQueryBuilder(query))
        try {
            const pathResponse = await callApi('post', 'path/project', query)
            console.log(pathResponse)
            // Once we see the data, we can see what error handling we need.
            if (true) {
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
}
