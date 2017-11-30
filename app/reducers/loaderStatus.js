import {
    QUERYBUILDER_FETCH_PATHS,
    QUERYBUILDER_FETCH_PATHS_FAILED,
    QUERYBUILDER_SHOW_PATHS    
} from '../actions/pathbuilder/actionTypes'

const initialState = {
    isLoading: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case QUERYBUILDER_FETCH_PATHS:
            return { ...state, isLoading: true }
        case QUERYBUILDER_FETCH_PATHS_FAILED:
        case QUERYBUILDER_SHOW_PATHS:
            return { ...state, isLoading: false }
        default:
            return state
    }
}