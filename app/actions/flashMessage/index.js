import {
  SHOW_MESSAGE,
  HIDE_MESSAGE,
} from './actionTypes';

const CONST_HIDE_MESSAGE_TIMEOUT = 4500;

const hideMessage = () => ({
  type: HIDE_MESSAGE,
});

export const showMessage = (message) => (dispatch) => {
  dispatch({
    type: SHOW_MESSAGE,
    message,
  });
  setTimeout(() => {
    dispatch(hideMessage());
  }, CONST_HIDE_MESSAGE_TIMEOUT);
};
