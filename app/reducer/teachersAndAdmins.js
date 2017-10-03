import {
  REQUEST_LOAD_TEACHERS_AND_ADMINS,
  SUCCESS_LOAD_TEACHERS_AND_ADMINS,
  ERROR_LOAD_TEACHERS_AND_ADMINS,
  REQUEST_CHANGE_ROLE,
  SUCCESS_CHANGE_ROLE,
  ERROR_CHANGE_ROLE,
} from '../actions/teachersAndAdmins/actionTypes';

const initialState = {
  teachersAndAdmins: [],
  isTeachersAndAdminsLoading: false,
  teachersAndAdminsLoadingError: '',
  teacherOrAdminChangeRoleError: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_LOAD_TEACHERS_AND_ADMINS:
      return Object.assign({}, state, { isTeachersAndAdminsLoading: true });

    case SUCCESS_LOAD_TEACHERS_AND_ADMINS:
      return Object.assign({}, state, {
        isTeachersAndAdminsLoading: false,
        teachersAndAdmins: action.teachersAndAdmins,
      });

    case ERROR_LOAD_TEACHERS_AND_ADMINS:
      return Object.assign({}, state, {
        isTeachersAndAdminsLoading: false,
        teachersAndAdminsLoadingError: action.error,
      });

    case REQUEST_CHANGE_ROLE:
      return Object.assign({}, state, {
        teachersAndAdmins: state.teachersAndAdmins.map((teacherOrAdmin) => {
          if (teacherOrAdmin._id !== action.teacherOrAdminId) {
            return teacherOrAdmin;
          }
          return Object.assign({}, teacherOrAdmin, {
            oldRole: teacherOrAdmin.role,
            role: action.role,
          });
        }),
      });

    case SUCCESS_CHANGE_ROLE:
      return state;

    case ERROR_CHANGE_ROLE:
      return Object.assign({}, state, {
        teacherOrAdminChangeRoleError: action.error,
        teachersAndAdmins: state.teachersAndAdmins.map((teacherOrAdmin) => {
          if (teacherOrAdmin._id !== action.teacherOrAdminId) {
            return teacherOrAdmin;
          }
          return Object.assign({}, teacherOrAdmin, { role: teacherOrAdmin.oldRole });
        }),
      });

    default:
      return state;
  }
};
