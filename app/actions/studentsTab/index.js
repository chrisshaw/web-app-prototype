import {
  REQUEST_STUDENTS_LIST,
  SUCCESS_STUDENTS_LIST,
  ERROR_STUDENTS_LIST,
  SELECT_EDITABLE_STUDENT,
  ADD_STUDENT_INTEREST,
  DELETE_STUDENT_INTEREST,
  REQUEST_SAVE_STUDENT_INTERESTS,
  SUCCESS_SAVE_STUDENT_INTERESTS,
  ERROR_SAVE_STUDENT_INTERESTS,
} from './actionTypes';
import { showMessage } from '../flashMessage';

const requestStudentsList = () => ({
  type: REQUEST_STUDENTS_LIST,
});

const studentsListSuccess = (students) => ({
  type: SUCCESS_STUDENTS_LIST,
  students,
});

const studentsListError = (error) => ({
  type: ERROR_STUDENTS_LIST,
  error,
});

export const fetchStudentsList = () => (dispatch, getState) => {
  dispatch(requestStudentsList());
  const userId = getState().authState.userId;

  return fetch(`/api/students?userId=${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed load students');
      }
      return response.json();
    })
    .then((students) => {
      dispatch(studentsListSuccess(students));
    })
    .catch((error) => {
      dispatch(studentsListError(error.message));
    });
};

export const selectEditableStudent = (student) => ({
  type: SELECT_EDITABLE_STUDENT,
  student,
});

export const addStudentInterest = (studentId, interestsCategory, interest) => ({
  type: ADD_STUDENT_INTEREST,
  studentId,
  interestsCategory,
  interest,
});

export const deleteStudentInterest = (studentId, interestsCategory, interestIndex) => ({
  type: DELETE_STUDENT_INTEREST,
  studentId,
  interestsCategory,
  interestIndex,
});

const requestSaveStudentInterests = () => ({
  type: REQUEST_SAVE_STUDENT_INTERESTS,
});

const successSaveStudentInterests = (studentId, interests) => ({
  type: SUCCESS_SAVE_STUDENT_INTERESTS,
  studentId,
  interests,
});

const errorSaveStudentInterests = (error) => ({
  type: ERROR_SAVE_STUDENT_INTERESTS,
  error,
});

export const saveStudentInterests = (student) => (dispatch) => {
  dispatch(requestSaveStudentInterests());

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _key: student._key,
      interests: student.interests,
    }),
  };

  return fetch('/api/student/interests', options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed when trying to save user interests');
      }
      return response.json();
    })
    .then((student) => {
      dispatch(successSaveStudentInterests(student._id, student.interests));
      dispatch(showMessage('Student interests saved'));
    })
    .catch((error) => {
      dispatch(errorSaveStudentInterests(error.message));
      dispatch(showMessage('Student interests did not save'));
    });
};
