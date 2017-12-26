import {
    PATHVIEWER_CHANGE_CURRENT_PATH,
    PATHVIEWER_MOVE_UP_FOCUS_AREA,
    PATHVIEWER_MOVE_DOWN_FOCUS_AREA,
    PATHVIEWER_ADD_FOCUS_AREA,
    PATHVIEWER_REMOVE_FOCUS_AREA,
    PATHVIEWER_CLEAR_DETAILS,
    PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS,
    PATHVIEWER_LOAD_FOCUS_AREA_OPTIONS,
    PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS_FAILED,
    REQUEST_RECOMMENDATION,
} from './actionTypes'

import callApi from '../../helper/api'

export const changeCurrentPathInPathViewer = index => ({
    type: PATHVIEWER_CHANGE_CURRENT_PATH,
    payload: { index }
})

export const removeFocusAreaInPathViewer = (projectId, focusAreaIndex) => ({
    type: PATHVIEWER_REMOVE_FOCUS_AREA,
    payload: { 
        projectId,
        focusAreaIndex
    }
})

export const addFocusAreaInPathViewer = (projectId, focusAreaIndex, focusAreaId) => ({
    type: PATHVIEWER_ADD_FOCUS_AREA,
    payload: {
        projectId,
        focusAreaIndex,
        focusAreaId
    }
})

export const moveUpFocusAreaInPathViewer = (projectId, focusAreaIndex) => ({
    type: PATHVIEWER_MOVE_UP_FOCUS_AREA,
    payload: {
        projectId,
        focusAreaIndex
    }
})

export const moveDownFocusAreaInPathViewer = (projectId, focusAreaIndex) => ({
    type: PATHVIEWER_MOVE_DOWN_FOCUS_AREA,
    payload: {
        projectId,
        focusAreaIndex
    }
})

export const closeDetailDrawerInPathViewer = () => ({
    type: PATHVIEWER_CLEAR_DETAILS
})

export const fetchFocusAreaOptions = userKey => ({
    type: PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS,
    payload: { userKey }
})

export const loadFocusAreaOptions = data => ({
    type: PATHVIEWER_LOAD_FOCUS_AREA_OPTIONS,
    payload: { data }
})

export const fetchFocusAreaOptionsFailed = error => ({
    type: PATHVIEWER_FETCH_FOCUS_AREA_OPTIONS_FAILED,
    payload: { error }
})

export const tryFetchFocusAreaOptions = userKey => async dispatch => {
    dispatch(fetchFocusAreaOptions(userKey))
    try {
        const entityResponse = await callApi('get', `user/${userKey}/entities`)
        if (true) {
            dispatch(loadFocusAreaOptions(entityResponse.data))
        } else {
            throw new Error('Something went wrong.')
        } 
    } catch (error) {
        console.log(error)
        dispatch(fetchFocusAreaOptionsFailed(error))
    }
}

export const changeRecommendation = data => async dispatch => {
    try {
        const payload = await callApi('post', '/recommendation', data)
        // Once we see the data, we can see what error handling we need.
        if (!!payload) {
            dispatch({
                type: REQUEST_RECOMMENDATION,
                payload,
            })
        } else {
            throw new Error('Something went wrong.')
        }
    } catch (err) {
        console.log(err)
    }
}