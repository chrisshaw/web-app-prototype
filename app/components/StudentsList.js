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

const StudentsList = ({ students, onEditInterestsClick }) => {
  if (!students.length) {
    return <p>There are no students yet</p>
  }

  return (
    <Table>
      <TableHeader displaySelectAll={false}
                   adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>First name</TableHeaderColumn>
          <TableHeaderColumn>Last name</TableHeaderColumn>
          <TableHeaderColumn>Interests</TableHeaderColumn>
          <TableHeaderColumn/>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {students.map((student) => (
          <TableRow key={student._id}>
            <TableRowColumn>
              {student.first}
            </TableRowColumn>
            <TableRowColumn>
              {student.last}
            </TableRowColumn>
            <TableRowColumn>
              <InterestsCol interests={student.interests}/>
            </TableRowColumn>
            <TableRowColumn>
              <FlatButton label="Edit interests"
                          onClick={(event) => {onEditInterestsClick(event, student);}}
              />
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

StudentsList.propTypes = {
  students: PropTypes.array.isRequired,
  onEditInterestsClick: PropTypes.func.isRequired,
};

StudentsList.defaultProps = {
  students: [],
};

export default StudentsList;
