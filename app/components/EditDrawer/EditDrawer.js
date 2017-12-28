import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux'

import Drawer from 'mui-next/Drawer';
import Icon from 'mui-next/Icon'
import IconButton from 'mui-next/IconButton';
import Typography from 'mui-next/Typography'
import Button from 'mui-next/Button'

import InputSection from '../InputSection/InputSection'
import DetailDrawerContent, { DetailSection } from '../DetailDrawerContent/DetailDrawerContent'
import Loader from '../Loader/Loader'

import { addStudentInterest, deleteStudentInterest, saveStudentInterests } from '../../actions/studentsTab'
import { closeDetailDrawerInPathViewer } from '../../actions/pathbuilder/pathviewerActionCreators'

import {
    globalGetCurrentStudentById,
    globalGetCurrentId,
    globalGetAllTopics
} from '../../reducers/index';

const interestSections = [
    
]

class EditDrawer extends Component {

    handleInterestChange = (studentId, interestCategory) => (event) => {
        if ( event.action === 'insert' ) {
            this.props.addStudentInterest(studentId, interestCategory, event.dataItem)
        } else if ( event.action === 'remove' ) {
            this.props.deleteStudentInterest(studentId, interestCategory, event.dataItem)
        }
    }
    
    handleSaveInterests = () => {
        const { saveStudentInterests, currentStudent } = this.props;
        saveStudentInterests(currentStudent);
    }

    render() {
        const { currentStudentId, currentStudent, topics, className, closeDetailDrawerInPathViewer } = this.props
        const isOpen = currentStudent !== undefined

        return (
            <Drawer
                open={isOpen}
                anchor={'right'}
                type='persistent'
                className={className}
            >
                {currentStudent && <DetailDrawerContent
                    title={currentStudent.name}
                    closeHandler={closeDetailDrawerInPathViewer}
                >
                    <InputSection
                        header="Careers"
                        placeholder="Start typing for suggestions"
                        value={currentStudent.interests.careers}
                        data={topics}
                        changeHandler={this.handleInterestChange(currentStudentId, 'careers')}
                    />
                    <InputSection
                        header="Causes"
                        placeholder="Start typing for suggestions"
                        value={currentStudent.interests.causes}
                        data={topics}
                        changeHandler={this.handleInterestChange(currentStudentId, 'causes')}
                    />
                    <InputSection
                        header="Hobbies"
                        placeholder="Start typing for suggestions"
                        value={currentStudent.interests.passions}
                        data={topics}
                        changeHandler={this.handleInterestChange(currentStudentId, 'passions')}
                    />
                    <InputSection
                        header="School and Community Issues"
                        placeholder="Start typing for suggestions"
                        value={currentStudent.interests.localIssues}
                        data={topics}
                        changeHandler={this.handleInterestChange(currentStudentId, 'localIssues')}
                    />
                    <InputSection
                        header="Sense of Humor"
                        placeholder="Start typing for suggestions"
                        value={currentStudent.interests.humor}
                        data={topics}
                        changeHandler={this.handleInterestChange(currentStudentId, 'humor')}
                    />
                    <Button
                        onClick={this.handleSaveInterests}
                        color='primary'
                    >
                        Save Interests
                    </Button>
                </DetailDrawerContent>}
            </Drawer>
        )
    }
}

const mapStateToProps = state => ({
    currentStudentId: globalGetCurrentId(state),
    currentStudent: globalGetCurrentStudentById(state, globalGetCurrentId(state)),
    topics: globalGetAllTopics(state)
})

export default connect(
    mapStateToProps,
    {
        closeDetailDrawerInPathViewer,
        addStudentInterest,
        deleteStudentInterest,
        saveStudentInterests
    }
)(EditDrawer)