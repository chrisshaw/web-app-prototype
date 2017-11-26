import {
    PATHVIEWER_CHANGE_CURRENT_PATH,
    PATHVIEWER_MOVE_UP_FOCUS_AREA,
    PATHVIEWER_MOVE_DOWN_FOCUS_AREA,
    PATHVIEWER_ADD_FOCUS_AREA,
    PATHVIEWER_REMOVE_FOCUS_AREA,
    PATHVIEWER_CLEAR_DETAILS
} from './actionTypes'

export const changeCurrentPathInPathViewer = index => ({
    type: PATHVIEWER_CHANGE_CURRENT_PATH,
    payload: { index }
})

export const moveUpFocusAreaInPathViewer = handle => {
    const parsedHandle = handle.split('/')

    return {
        type: PATHVIEWER_MOVE_UP_FOCUS_AREA,
        payload: {
            project: parsedHandle[0],
            index: parsedHandle[1] 
        }
    }
}

export const closeDetailDrawerInPathViewer = () => ({
    type: PATHVIEWER_CLEAR_DETAILS
})