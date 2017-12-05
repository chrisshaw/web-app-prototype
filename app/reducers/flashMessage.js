import {
  SHOW_MESSAGE,
  HIDE_MESSAGE,
} from '../actions/flashMessage/actionTypes';
import { QUERYBUILDER_FETCH_PATHS_FAILED } from '../actions/pathbuilder/actionTypes'
import { } from '../actions/auth'
import { SIGN_UP_USER_FAILED, SIGN_UP_USER_SUCCESS } from '../actions/auth/actionTypes';

const initialState = {
  isMessageShowing: false,
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      return Object.assign({}, state, {
        isMessageShowing: true,
        message: action.message
      })
    case QUERYBUILDER_FETCH_PATHS_FAILED:
      return Object.assign({}, state, {
        isMessageShowing: true,
        message: action.payload.err
      })
    case SIGN_UP_USER_SUCCESS:
      return { ...state, isMessageShowing: true, message: action.payload.message }
    case SIGN_UP_USER_FAILED:
      return { ...state, isMessageShowing: true, message: action.payload.error }
    case HIDE_MESSAGE:
      return Object.assign({}, state, { isMessageShowing: false });

    default:
      return state;
  }
};
