import React, { Component } from 'react';
import Button from 'mui-next/Button'
import helper from '../../helper';
import { connect } from 'react-redux';
import InputSection from '../InputSection/InputSection'
import Typography from 'mui-next/Typography'
import Style from './QueryBuilder.css'

import {
    globalGetSelectedCourses,
    globalGetPotentialCourses,
    globalGetSelectedTopics,
    globalGetPotentialTopics,
    globalGetSelectedSubjects,
    globalGetPotentialSubjects,
    globalGetSelectedStandards,
    globalGetPotentialStandards
} from '../../reducers/index'

import {
    tryFetchOptionsTableForQueryBuilder,
    selectGradeInQueryBuilder,
    selectCourseInQueryBuilder,
    selectTopicInQueryBuilder,
    selectSubjectInQueryBuilder,
    selectStandardInQueryBuilder
 } from '../../actions/pathbuilder/querybuilderActionCreators'

class QueryBuilder extends Component{

    componentDidMount = () => {
        this.props.tryFetchOptionsTableForQueryBuilder(this.props.userId.split('/').pop())
    }

    handleSubmit = () => {
        console.log('I submitted')
    }

    render(){
        return (
            <div className={Style.queryContainer}>
                <Typography type="display1">
                    Build Paths
                </Typography>
                {/* <InputSection
                    header="For my students in grades"
                    placeholder="9, 10, 11, 12..."
                    value={this.props.selectedGrades}
                    data={this.props.potentialGrades}
                    changeHandler={this.props.selectGradeInQueryBuilder}
                /> */}
                <InputSection
                    header="enrolled in courses"
                    placeholder="Biology, English 10, U.S. History..."
                    value={this.props.selectedCourses}
                    data={this.props.potentialCourses}
                    changeHandler={this.props.selectCourseInQueryBuilder}
                    valueField="_key"
                    textField="name"
                />
                <InputSection
                    header="will explore projects about"
                    placeholder="social justice, genetics, investing..."
                    value={this.props.selectedTopics}
                    data={this.props.potentialTopics}     
                    changeHandler={this.props.selectTopicInQueryBuilder}             
                />
                <InputSection
                    header="while learning in subjects"
                    placeholder="math, science, english..."
                    value={this.props.selectedSubjects}
                    data={this.props.potentialSubjects}
                    changeHandler={this.props.selectSubjectInQueryBuilder}
                />
                <InputSection
                    header="that aligns to standards"
                    placeholder="CCSS-ELA, CCSS-Math, NGSS..."
                    value={this.props.selectedStandards}
                    data={this.props.potentialStandards}
                    changeHandler={this.props.selectStandardInQueryBuilder}
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
        // selectedGrades: store.pathbuilder.getSelectedGrades,
        // potentialGrades: store.pathbuilder.getPotentialGrades,
        selectedCourses: globalGetSelectedCourses(store),
        potentialCourses: globalGetPotentialCourses(store),
        selectedTopics: globalGetSelectedTopics(store),
        potentialTopics: globalGetPotentialTopics(store),
        selectedSubjects: globalGetSelectedSubjects(store),
        potentialSubjects: globalGetPotentialSubjects(store),
        selectedStandards: globalGetSelectedStandards(store),
        potentialStandards: globalGetPotentialStandards(store),
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
        selectGradeInQueryBuilder,
        selectCourseInQueryBuilder,
        selectTopicInQueryBuilder,
        selectSubjectInQueryBuilder,
        selectStandardInQueryBuilder
    })(QueryBuilder);

