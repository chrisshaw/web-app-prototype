import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeRole } from '../actions/teachersAndAdmins';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const TEACHER_ROLE = 'auth_roles/teacher';
const ADMIN_ROLE = 'auth_roles/admin';

const styles = {
  dropdown: {
    verticalAlign: 'middle',
  },
};

const TeachersTab = ({ teachersAndAdmins, changeRole }) => {
  if (!teachersAndAdmins.length) {
    return <p>There are no teachers or admins</p>
  }

  return (
    <Table>
      <TableHeader displaySelectAll={false}
                   adjustForCheckbox={false}
      >
        <TableRow>
          <TableHeaderColumn>First name</TableHeaderColumn>
          <TableHeaderColumn>Last name</TableHeaderColumn>
          <TableHeaderColumn>Email</TableHeaderColumn>
          <TableHeaderColumn>Role</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {teachersAndAdmins.map((teacherOrAdmin) => (
          <TableRow key={teacherOrAdmin._id}>
            <TableRowColumn>{teacherOrAdmin.first}</TableRowColumn>
            <TableRowColumn>{teacherOrAdmin.last}</TableRowColumn>
            <TableRowColumn>{teacherOrAdmin.username}</TableRowColumn>
            <TableRowColumn>
              <SelectField value={teacherOrAdmin.role}
                           onChange={(event, index, role) => {
                             changeRole(teacherOrAdmin, role);
                           }}
                           onClick={(event) => {
                             event.stopPropagation();
                           }}
                           style={styles.dropdown}
              >
                <MenuItem value={TEACHER_ROLE} primaryText="Teacher"/>
                <MenuItem value={ADMIN_ROLE} primaryText="Admin"/>
              </SelectField>
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const mapStateToProps = ({ teachersAndAdmins }) => ({
  teachersAndAdmins: teachersAndAdmins.teachersAndAdmins,
});

const mapDispatchToProps = (dispatch) => ({
  changeRole: (teacherOrAdminId, role) => {
    dispatch(changeRole(teacherOrAdminId, role));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TeachersTab);
