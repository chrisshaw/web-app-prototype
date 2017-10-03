import {
  REQUEST_COURSES_LIST,
  SUCCESS_COURSES_LIST,
  ERROR_COURSES_LIST,
  SELECT_EDITABLE_COURSE,
  ADD_COURSE_INTEREST,
  DELETE_COURSE_INTEREST,
  REQUEST_SAVE_COURSE_INTERESTS,
  SUCCESS_SAVE_COURSE_INTERESTS,
  ERROR_SAVE_COURSE_INTERESTS,
} from './actionTypes';
import { showMessage } from '../flashMessage';

const requestCoursesList = () => ({
  type: REQUEST_COURSES_LIST,
});

const coursesListSuccess = (courses) => ({
  type: SUCCESS_COURSES_LIST,
  courses,
});

const coursesListError = (error) => ({
  type: ERROR_COURSES_LIST,
  error,
});

export const fetchCoursesList = () => (dispatch, getState) => {
  dispatch(requestCoursesList());
  const userId = getState().authState.userId;

  return fetch(`/api/course?userId=${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed load courses');
      }
      return response.json();
    })
    .then((courses) => {
      dispatch(coursesListSuccess(courses));
    })
    .catch((error) => {
      dispatch(coursesListError(error.message));
    });
};

export const selectEditableCourse = (course) => ({
  type: SELECT_EDITABLE_COURSE,
  course,
});

export const addCourseInterest = (courseId, interestsCategory, interest) => ({
  type: ADD_COURSE_INTEREST,
  courseId,
  interestsCategory,
  interest,
});

export const deleteCourseInterest = (courseId, interestsCategory, interestIndex) => ({
  type: DELETE_COURSE_INTEREST,
  courseId,
  interestsCategory,
  interestIndex,
});

const requestSaveCourseInterests = () => ({
  type: REQUEST_SAVE_COURSE_INTERESTS,
});

const successSaveCourseInterests = (courseId, interests) => ({
  type: SUCCESS_SAVE_COURSE_INTERESTS,
  courseId,
  interests,
});

const errorSaveCourseInterests = (error) => ({
  type: ERROR_SAVE_COURSE_INTERESTS,
  error,
});

export const saveCourseInterests = (course) => (dispatch) => {
  dispatch(requestSaveCourseInterests());

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _key: course._key,
      interests: course.interests,
    }),
  };

  return fetch('/api/course/interests', options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed when trying to save user interests');
      }
      return response.json();
    })
    .then((course) => {
      dispatch(successSaveCourseInterests(course._id, course.interests));
      dispatch(showMessage('Course interests saved'));
    })
    .catch((error) => {
      dispatch(errorSaveCourseInterests(error.message));
      dispatch(showMessage('Course interests did not save'));
    });
};
