import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import Table, { TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table'
import Button from 'material-ui/Button'
import Style from './StudentTable.css'
import InterestsCol from '../InterestsCol'

import {
    selectEditableStudent,
    addStudentInterest,
    deleteStudentInterest,
    saveStudentInterests
} from '../../actions/studentsTab';

import { globalGetStudents } from '../../reducers'

const styles = {
    root: {
        textAlign: 'center'
    }
}

const StudentTable = props => {
    
    const makeSelectEditableStudent = id => () => props.selectEditableStudent(id)

    const renderRow = (student, i) => (
        <TableRow key={student._key}>
            <TableCell>{student.name}</TableCell>
            <TableCell>
                <InterestsCol interests={student.interests} />
            </TableCell>
            <TableCell classes={{
                root: props.classes.root
            }}>
                <Button onClick={makeSelectEditableStudent(student._id)}>
                    Edit Interests
                </Button>
            </TableCell>
        </TableRow>
    )


    return (
        <Table className={Style.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Interests</TableCell>
                    <TableCell/>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.students.map(renderRow)}
            </TableBody>
        </Table>
    )
}

const mapStateToProps = state => ({
    students: globalGetStudents(state)
})

const connectedStudentTable = connect(
    mapStateToProps,
    {
        selectEditableStudent
    }
)(StudentTable)

const StyledStudentTable = withStyles(styles)(connectedStudentTable)

export default StyledStudentTable
