import React, { Component } from 'react';
import Button from 'material-ui/Button'
import helper from '../../helper';
import { connect } from 'react-redux';
import InputSection from '../InputSection/InputSection'
import Typography from 'material-ui/Typography'
import Style from './QueryBuilder.css'

import {
    globalGetPotentialGrades,
    globalGetSelectedCourses,
    globalGetPotentialCourses,
    globalGetSelectedTopics,
    globalGetPotentialTopics,
    globalGetSelectedGrades,
    globalGetSelectedSubjects,
    globalGetPotentialSubjects,
    globalGetSelectedStandards,
    globalGetPotentialStandards,
    globalGetChosenStudents
} from '../../reducers/index'

import {
    tryFetchOptionsTableForQueryBuilder,
    updateGradeInQueryBuilder,
    updateCourseInQueryBuilder,
    updateTopicInQueryBuilder,
    updateSubjectInQueryBuilder,
    updateStandardInQueryBuilder,
    tryFetchPathsWithQueryBuilder
 } from '../../actions/pathbuilder/querybuilderActionCreators'

 import {
     tryFetchFocusAreaOptions
 } from '../../actions/pathbuilder/pathviewerActionCreators'

class QueryBuilder extends Component{

    componentDidMount = () => {
        this.props.tryFetchOptionsTableForQueryBuilder(this.props.userId.split('/').pop())
        this.props.tryFetchFocusAreaOptions(this.props.userId.split('/').pop())
    }

    handleSubmit = () => {
        const queryObject = {
            grades: this.props.selectedGrades,
            courses: this.props.selectedCourses,
            topics: this.props.selectedTopics,
            subjects: this.props.selectedSubjects,
            standards: this.props.selectedStandards
        }
        this.props.tryFetchPathsWithQueryBuilder(queryObject)
    }

    render(){
        return (
            <div className={Style.queryContainer}>
                <Typography type="display1">
                    Build Paths
                </Typography>
                <InputSection
                    header="For my students in grades"
                    placeholder="9, 10, 11, 12..."
                    value={this.props.selectedGrades}
                    data={this.props.potentialGrades}
                    changeHandler={this.props.updateGradeInQueryBuilder}
                />
                <InputSection
                    header="enrolled in courses"
                    placeholder="Biology, English 10..."
                    value={this.props.selectedCourses}
                    data={this.props.potentialCourses}
                    changeHandler={this.props.updateCourseInQueryBuilder}
                    valueField="_key"
                    textField="name"
                />
                <InputSection
                    header="will explore projects about"
                    placeholder="social justice, genetics..."
                    value={this.props.selectedTopics}
                    data={this.props.potentialTopics}     
                    changeHandler={this.props.updateTopicInQueryBuilder}             
                />
                <InputSection
                    header="while learning in subjects"
                    placeholder="math, science..."
                    value={this.props.selectedSubjects}
                    data={this.props.potentialSubjects}
                    changeHandler={this.props.updateSubjectInQueryBuilder}
                />
                <InputSection
                    header="that aligns to standards"
                    placeholder="CCSS-Math, NGSS..."
                    value={this.props.selectedStandards}
                    data={this.props.potentialStandards}
                    changeHandler={this.props.updateStandardInQueryBuilder}
                />           
                <Button
                    color="primary"
                    onClick={this.handleSubmit}
                    className={Style.button}
                >
                    Get Recommended Paths 
                </Button>          
                {/* { (this.props.permissions && this.props.permissions.includes('publish')) ? (
                    <Button
                        color="primary"
                        onClick={this.props.handleSend}
                    >
                        Start Publishing to LMS
                    </Button>
                 ) : null} */}
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        selectedGrades: globalGetSelectedGrades(store),
        potentialGrades: globalGetPotentialGrades(store),
        selectedCourses: globalGetSelectedCourses(store),
        potentialCourses: globalGetPotentialCourses(store),
        selectedTopics: globalGetSelectedTopics(store),
        potentialTopics: globalGetPotentialTopics(store),
        selectedSubjects: globalGetSelectedSubjects(store),
        potentialSubjects: globalGetPotentialSubjects(store),
        selectedStandards: globalGetSelectedStandards(store),
        potentialStandards: globalGetPotentialStandards(store),
        chosenStudents: globalGetChosenStudents(store),
        role: store.authState.role,
        username: store.authState.username,
        permissions:  store.authState.permissions,
        userId: store.authState.userId
    }
}

export default connect(
    mapStateToProps,
    {
        tryFetchOptionsTableForQueryBuilder,
        updateGradeInQueryBuilder,
        updateCourseInQueryBuilder,
        updateTopicInQueryBuilder,
        updateSubjectInQueryBuilder,
        updateStandardInQueryBuilder,
        tryFetchPathsWithQueryBuilder,
        tryFetchFocusAreaOptions
    }
)(QueryBuilder);