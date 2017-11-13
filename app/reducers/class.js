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
} from '../actions/class/actionTypes';

const initialState = {
  courses: [],
  isCoursesLoading: false,
  editableCourseId: '',
  isCourseInterestSaving: false,

};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_COURSES_LIST:
      return Object.assign({}, state, { isCoursesLoading: true });

    case SUCCESS_COURSES_LIST:
      return Object.assign({}, state, {
        isCoursesLoading: false,
        courses: action.courses,
      });

    case ERROR_COURSES_LIST:
      return Object.assign({}, state, { isCoursesLoading: false });

    case SELECT_EDITABLE_COURSE:
      return Object.assign({}, state, { editableCourseId: action.course._id });

    case ADD_COURSE_INTEREST:
      return Object.assign({}, state, {
        courses: state.courses.map((course) => {
          if (course._id !== action.courseId) {
            return course;
          }
          const modifiedInterests = Object.assign({}, course.interests, {
            [action.interestsCategory]: [...course.interests[action.interestsCategory], action.interest],
          });
          return Object.assign({}, course, { interests: modifiedInterests });
        }),
      });

    case DELETE_COURSE_INTEREST:
      return Object.assign({}, state, {
        courses: state.courses.map((course) => {
          if (course._id !== action.courseId) {
            return course;
          }
          const modifiedInterests = Object.assign({}, course.interests, {
            [action.interestsCategory]: course.interests[action.interestsCategory].filter((interest, index) => index !== action.interestIndex),
          });
          return Object.assign({}, course, { interests: modifiedInterests });
        }),
      });

    case REQUEST_SAVE_COURSE_INTERESTS:
      return Object.assign({}, state, { isCourseInterestsSaving: true });

    case SUCCESS_SAVE_COURSE_INTERESTS:
      return Object.assign({}, state, {
        isCourseInterestsSaving: false,
        courses: state.courses.map((course) => {
          if (course._id !== action.courseId) {
            return course;
          }
          return Object.assign({}, course, { interests: action.interests });
        }),
      });

    case ERROR_SAVE_COURSE_INTERESTS:
      return Object.assign({}, state, { isCourseInterestsSaving: false });

    default:
      return state;
  }
};
