import {
  SHOW_MESSAGE,
  HIDE_MESSAGE,
} from './actionTypes';

const HIDE_MESSAGE_TIMEOUT = 2000;

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
  }, HIDE_MESSAGE_TIMEOUT);
};
