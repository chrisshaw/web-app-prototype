import {
    PATHVIEWER_CHANGE_CURRENT_PATH,
    PATHVIEWER_MOVE_UP_FOCUS_AREA,
    PATHVIEWER_MOVE_DOWN_FOCUS_AREA,
    PATHVIEWER_ADD_FOCUS_AREA,
    PATHVIEWER_REMOVE_FOCUS_AREA,
    PATHVIEWER_CLEAR_DETAILS
} from './actionTypes'

const parseHandlde = handle => {
    const parsed = handle.split('/')
    return {
        project: parsed[0],
        index: parsed[1]
    }
}

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

export const addFocusAreaInPathViewer = handle => ({
    type: PATHVIEWER_ADD_FOCUS_AREA,
    payload: {}
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