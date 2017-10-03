import {
  SHOW_MESSAGE,
  HIDE_MESSAGE,
} from '../actions/flashMessage/actionTypes';

const initialState = {
  isMessageShowing: false,
  message: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MESSAGE:
      return {
        isMessageShowing: true,
        message: action.message
      };

    case HIDE_MESSAGE:
      return Object.assign({}, state, { isMessageShowing: false });

    default:
      return state;
  }
};
