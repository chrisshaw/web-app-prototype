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
} from '../actions/studentsTab/actionTypes';

const initialState = {
  students: [],
  editableStudentId: '',
  isStudentsLoading: false,
  studentsLoadingError: '',
  isStudentInterestsSaving: false,
  studentInterestSaveError: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_STUDENTS_LIST:
      return Object.assign({}, state, { isStudentsLoading: true });

    case SUCCESS_STUDENTS_LIST:
      return Object.assign({}, state, {
        isStudentsLoading: false,
        students: action.students,
      });

    case ERROR_STUDENTS_LIST:
      return Object.assign({}, state, {
        isStudentsLoading: false,
        studentsLoadingError: action.error.message,
      });

    case SELECT_EDITABLE_STUDENT:
      return Object.assign({}, state, { editableStudentId: action.student._id });

    case ADD_STUDENT_INTEREST:
      return Object.assign({}, state, {
        students: state.students.map((student) => {
          if (student._id !== action.studentId) {
            return student;
          }
          const modifiedInterests = Object.assign({}, student.interests, {
            [action.interestsCategory]: [...student.interests[action.interestsCategory], action.interest],
          });
          return Object.assign({}, student, { interests: modifiedInterests });
        }),
      });

    case DELETE_STUDENT_INTEREST:
      return Object.assign({}, state, {
        students: state.students.map((student) => {
          if (student._id !== action.studentId) {
            return student;
          }
          const modifiedInterests = Object.assign({}, student.interests, {
            [action.interestsCategory]: student.interests[action.interestsCategory].filter((interest, index) => index !== action.interestIndex),
          });
          return Object.assign({}, student, { interests: modifiedInterests });
        }),
      });

    case REQUEST_SAVE_STUDENT_INTERESTS:
      return Object.assign({}, state, { isStudentInterestsSaving: true });

    case SUCCESS_SAVE_STUDENT_INTERESTS:
      return Object.assign({}, state, {
        isStudentInterestsSaving: false,
        students: state.students.map((student) => {
          if (student._id !== action.studentId) {
            return student;
          }
          return Object.assign({}, student, { interests: action.interests });
        }),
      });

    case ERROR_SAVE_STUDENT_INTERESTS:
      return Object.assign({}, state, {
        isStudentInterestsSaving: false,
        studentInterestSaveError: action.error,
      });

    default:
      return state;
  }
}
