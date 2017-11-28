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

export const removeFocusAreaInPathViewer = handle => ({
    type: PATHVIEWER_REMOVE_FOCUS_AREA,
    payload: { parsedHandle: parseHandle(handle) }
})

export const addFocusAreaInPathViewer = handle => ({
    type: PATHVIEWER_ADD_FOCUS_AREA,
    payload: { parsedHandle: parseHandle(handle) }
})
export const moveUpFocusAreaInPathViewer = handle => ({
    type: PATHVIEWER_MOVE_UP_FOCUS_AREA,
    payload: { parsedHandle: parseHandle(handle) }
})

export const moveDownFocusAreaInPathViewer = handle => ({
    type: PATHVIEWER_MOVE_DOWN_FOCUS_AREA,
    payload: { parsedHandle: parseHandle(handle) }
})

export const closeDetailDrawerInPathViewer = () => ({
    type: PATHVIEWER_CLEAR_DETAILS
})