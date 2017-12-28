import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import StudentsList from '../StudentsList';
import EditStudentInterestsDrawer from '../EditStudentInterestsDrawer';
import {
  selectEditableStudent,
  addStudentInterest,
  deleteStudentInterest,
  saveStudentInterests,
} from '../../actions/studentsTab';

class StudentsTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
    };

    this.handleEditInterestsClick = this.handleEditInterestsClick.bind(this);
    this.handleCloseDrawerClick = this.handleCloseDrawerClick.bind(this);
    this.handleAddStudentInterest = this.handleAddStudentInterest.bind(this);
    this.handleDeleteStudentInterest = this.handleDeleteStudentInterest.bind(this);
    this.handleSaveInterests = this.handleSaveInterests.bind(this);
  }

  handleEditInterestsClick(event, student) {
    event.stopPropagation();
    this.props.selectEditableStudent(student);
    this.setState({ isDrawerOpen: true });
  }

  handleCloseDrawerClick() {
    this.setState({ isDrawerOpen: false });
  }

  handleAddStudentInterest(interestsCategory, interest) {
    const { addInterestHandler, editableStudent } = this.props;
    addInterestHandler(editableStudent._id, interestsCategory, interest);
  }

  handleDeleteStudentInterest(interestsCategory, interestIndex) {
    const { deleteInterestHandler, editableStudent } = this.props;
    deleteInterestHandler(editableStudent._id, interestsCategory, interestIndex);
  }

  handleSaveInterests() {
    const { saveStudentInterests, editableStudent } = this.props;
    saveStudentInterests(editableStudent);
  }

  render() {
    const { isStudentsLoading, students, editableStudent } = this.props;
    if (isStudentsLoading) {
      return (<p>Loading...</p>);
    }
    return (
      <div>
        <StudentsList students={students}
                      onEditInterestsClick={this.handleEditInterestsClick}
        />
        <EditStudentInterestsDrawer open={this.state.isDrawerOpen}
                                    student={editableStudent}
                                    onCloseClick={this.handleCloseDrawerClick}
                                    onAddInterest={this.handleAddStudentInterest}
                                    onDeleteInterest={this.handleDeleteStudentInterest}
                                    onSaveInterests={this.handleSaveInterests}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ studentsTab }) => ({
  isStudentsLoading: studentsTab.isStudentsLoading,
  students: studentsTab.students,
  editableStudent: studentsTab.students.find((student) => student._id === studentsTab.editableStudentId),
});

const mapDispatchToProps = (dispatch) => ({
  selectEditableStudent: (student) => {
    dispatch(selectEditableStudent(student));
  },
  addInterestHandler: (studentId, interestsCategory, interest) => {
    dispatch(addStudentInterest(studentId, interestsCategory, interest));
  },
  deleteInterestHandler: (studentId, interestsCategory, interestIndex) => {
    dispatch(deleteStudentInterest(studentId, interestsCategory, interestIndex));
  },
  saveStudentInterests: (student) => {
    dispatch(saveStudentInterests(student));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentsTab);
