import {
    REQUEST_FOCUS_AREA_INFO,
    SUCCESS_FOCUS_AREA_INFO,
    ERROR_FOCUS_AREA_INFO
} from './pathbuilder/actionTypes'

export const selectFocusArea = (focusArea) => (dispatch) => {
  dispatch(requestFocusAreaInfo());

  // let fa = focusArea;
  //   console.log('-- fa', fa)
  // while (typeof focusArea !== "string") {
  //     fa = fa[0];
  // }
  const focusAreaKey = focusArea.split('/')[1].split('_').shift();
  //console.log('-- fa key', focusAreaKey)

  return fetch('/api/path/focus_area_details/' + focusAreaKey)
    .then((response) => {
      if (!response.ok) {
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

export const requestFocusAreaInfo = () => ({
  type: REQUEST_FOCUS_AREA_INFO,
});

export const successFocusAreaInfo = (focusArea) => ({
  type: SUCCESS_FOCUS_AREA_INFO,
  focusArea,
});

export const errorFocusAreaInfo = (error) => ({
  type: ERROR_FOCUS_AREA_INFO,
  error,
});
