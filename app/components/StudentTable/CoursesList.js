import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import InterestsCol from './InterestsCol';

const CoursesList = ({ courses, onEditInterestsClick }) => {
  if (!courses.length) {
    return <p>There are no courses yet</p>
  }

  return (
    <Table>
      <TableHeader displaySelectAll={false}
                   adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>Course name</TableHeaderColumn>
          <TableHeaderColumn>Interests</TableHeaderColumn>
          <TableHeaderColumn/>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {courses.map((course) => (
          <TableRow key={course._id}>
            <TableRowColumn>
              {course.name}
            </TableRowColumn>
            <TableRowColumn>
              <InterestsCol interests={course.interests}/>
            </TableRowColumn>
            <TableRowColumn>
              <FlatButton label="Edit interests"
                          onClick={(event) => {onEditInterestsClick(event, course);}}
              />
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

CoursesList.propTypes = {
  courses: PropTypes.array.isRequired,
  onEditInterestsClick: PropTypes.func.isRequired,
};

CoursesList.defaultProps = {
  courses: [],
};

export default CoursesList;

