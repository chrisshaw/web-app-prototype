export const selectFocusArea = (focusArea) => (dispatch) => {
  dispatch(requestFocusAreaInfo());
  const focusAreaId = focusArea._id.split('/')[1];

  return fetch('/api/path/focus_area_details/' + focusAreaId)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed when trying to get focus area details');
      }
      return response.json();
    })
    .then((focusAreaInfo) => {
      dispatch(successFocusAreaInfo(Object.assign({}, focusArea, focusAreaInfo)));
    })
    .catch((error) => {
      dispatch(errorFocusAreaInfo(error));
    });
};

export const requestFocusAreaInfo = () => ({
  type: 'REQUEST_FOCUS_AREA_INFO',
});

export const successFocusAreaInfo = (focusArea) => ({
  type: 'SUCCESS_FOCUS_AREA_INFO',
  focusArea,
});

export const errorFocusAreaInfo = (error) => ({
  type: 'ERROR_FOCUS_AREA_INFO',
  error,
});
