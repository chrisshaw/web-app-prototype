import {
    REQUEST_PATH_RELATED_PROJECTS,
    SUCCESS_PATH_RELATED_PROJECTS,
    ERROR_PATH_RELATED_PROJECTS
} from './pathbuilder/actionTypes'

export const selectPath = (pathName) => (dispatch) => {
  dispatch(requestPathRelatedProjects(pathName));

  return fetch('/api/path/related_projects/' + pathName)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed when trying to get path related projects');
      }
      return response.json();
    })
    .then((relatedProjects) => {
      dispatch(successPathRelatedProjects(relatedProjects));
    })
    .catch((error) => {
      dispatch(errorPathRelatedProjects(error));
    });
};

export const requestPathRelatedProjects = (topic) => ({
  type: REQUEST_PATH_RELATED_PROJECTS,
  topic
});

export const successPathRelatedProjects = (relatedProjects) => ({
  type: SUCCESS_PATH_RELATED_PROJECTS,
  relatedProjects,
});

export const errorPathRelatedProjects = (error) => ({
  type: ERROR_PATH_RELATED_PROJECTS,
  error,
});
