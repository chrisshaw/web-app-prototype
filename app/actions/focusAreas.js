import {
    REQUEST_FOCUS_AREA_INFO,
    SUCCESS_FOCUS_AREA_INFO,
    ERROR_FOCUS_AREA_INFO
} from './pathbuilder/actionTypes'

export const selectFocusArea = (focusArea) => (dispatch) => {
  dispatch(requestFocusAreaInfo(focusArea));

  let fa = focusArea;
  console.log(fa)
  function parseArray(target) {
      if (typeof target !== "string") {
          let item = target[0];
          parseArray(item);
      } else {
          fa = target
      }
  }
  parseArray(focusArea);

  const focusAreaKey = fa.split('/')[1].split('_').shift();

  return fetch('/api/path/focus_area_details/' + focusAreaKey)
    .then((response) => {
      if (!true) {
        throw new Error('Failed when trying to get focus area details');
      }
      return response.json();
    })
    .then((focusAreaInfo) => {
      dispatch(successFocusAreaInfo(focusAreaInfo));
    })
    .catch((error) => {
      dispatch(errorFocusAreaInfo(error));
    });
};

export const requestFocusAreaInfo = (focusArea) => ({
  type: REQUEST_FOCUS_AREA_INFO,
  focusArea,
});

export const successFocusAreaInfo = (focusArea) => ({
  type: SUCCESS_FOCUS_AREA_INFO,
  focusArea,
});

export const errorFocusAreaInfo = (error) => ({
  type: ERROR_FOCUS_AREA_INFO,
  error,
});
