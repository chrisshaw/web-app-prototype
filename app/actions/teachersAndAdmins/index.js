import {
  REQUEST_LOAD_TEACHERS_AND_ADMINS,
  SUCCESS_LOAD_TEACHERS_AND_ADMINS,
  ERROR_LOAD_TEACHERS_AND_ADMINS,
  REQUEST_CHANGE_ROLE,
  SUCCESS_CHANGE_ROLE,
  ERROR_CHANGE_ROLE,
} from './actionTypes';
import { showMessage } from '../flashMessage';

const requestTeachersAndAdmins = () => ({
  type: REQUEST_LOAD_TEACHERS_AND_ADMINS,
});

const successTeachersAndAdmins = (teachersAndAdmins) => ({
  type: SUCCESS_LOAD_TEACHERS_AND_ADMINS,
  teachersAndAdmins,
});

const errorTeachersAndAdmins = (error) => ({
  type: ERROR_LOAD_TEACHERS_AND_ADMINS,
  error,
});

export const fetchTeachersAndAdmins = () => (dispatch, getState) => {
  dispatch(requestTeachersAndAdmins());
  const userId = getState().authState.userId;

  fetch(`/api/teachers_and_admins?adminUserId=${userId}`)
    .then((result) => {
      if (!result.ok) {
        throw new Error('Server error');
      }
      return result.json();
    })
    .then((teachersAndAdmins) => {
      dispatch(successTeachersAndAdmins(teachersAndAdmins));
    })
    .catch((error) => {
      dispatch(errorTeachersAndAdmins(error.message));
    });
};

const requestChangeRole = (teacherOrAdminId, role) => ({
  type: REQUEST_CHANGE_ROLE,
  teacherOrAdminId,
  role,
});

const successChangeRole = () => ({
  type: SUCCESS_CHANGE_ROLE,
});

const errorChangeRole = (teacherOrAdminId, error) => ({
  type: ERROR_CHANGE_ROLE,
  teacherOrAdminId,
  error,
});

export const changeRole = (teacherOrAdmin, role) => (dispatch, getState) => {
  if (teacherOrAdmin.role === role) {
    return;
  }

  const teacherOrAdminId = teacherOrAdmin._id;
  dispatch(requestChangeRole(teacherOrAdminId, role));

  const currentUserId = getState().authState.userId;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teacherOrAdminId, role, currentUserId }),
  };

  fetch('/api/teachers_and_admins/role', options)
    .then((result) => {
      if (!result.ok) {
        throw new Error('Server error');
      }
      dispatch(successChangeRole());
      dispatch(showMessage('Role changed'));
    })
    .catch((error) => {
      dispatch(errorChangeRole(teacherOrAdminId, error.message));
      dispatch(showMessage('Role did not change'));
    });
};
