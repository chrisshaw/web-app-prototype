import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CoursesList from './CoursesList';
import EditCourseInterestsDrawer from './EditCourseInterestsDrawer';
import {
  selectEditableCourse,
  addCourseInterest,
  deleteCourseInterest,
  saveCourseInterests,
} from '../actions/class';

class ClassTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
    };

    this.handleEditInterestsClick = this.handleEditInterestsClick.bind(this);
    this.handleCloseDrawerClick = this.handleCloseDrawerClick.bind(this);
    this.handleAddCourseInterest = this.handleAddCourseInterest.bind(this);
    this.handleDeleteCourseInterest = this.handleDeleteCourseInterest.bind(this);
    this.handleSaveInterests = this.handleSaveInterests.bind(this);
  }

  handleEditInterestsClick(event, course) {
    event.stopPropagation();
    this.props.selectEditableCourse(course);
    this.setState({ isDrawerOpen: true });
  }

  handleCloseDrawerClick() {
    this.setState({ isDrawerOpen: false });
  }

  handleAddCourseInterest(interestsCategory, interest) {
    const { addCourseInterest, editableCourse } = this.props;
    addCourseInterest(editableCourse._id, interestsCategory, interest);
  }

  handleDeleteCourseInterest(interestsCategory, interestIndex) {
    const { deleteCourseInterest, editableCourse } = this.props;
    deleteCourseInterest(editableCourse._id, interestsCategory, interestIndex);
  }

  handleSaveInterests() {
    const { saveCourseInterests, editableCourse } = this.props;
    saveCourseInterests(editableCourse);
  }

  render() {
    const { isCoursesLoading, courses, editableCourse } = this.props;
    if (isCoursesLoading) {
      return (<p>Loading...</p>);
    }
    return (
      <div>
        <CoursesList courses={courses}
                     onEditInterestsClick={this.handleEditInterestsClick}
        />
        <EditCourseInterestsDrawer open={this.state.isDrawerOpen}
                                   course={editableCourse}
                                   onCloseClick={this.handleCloseDrawerClick}
                                   onAddInterest={this.handleAddCourseInterest}
                                   onDeleteInterest={this.handleDeleteCourseInterest}
                                   onSaveInterests={this.handleSaveInterests}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ classState }) => ({
  isCoursesLoading: classState.isCoursesLoading,
  courses: classState.courses,
  editableCourse: classState.courses.find((course) => course._id === classState.editableCourseId),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    selectEditableCourse,
    addCourseInterest,
    deleteCourseInterest,
    saveCourseInterests,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ClassTab);
