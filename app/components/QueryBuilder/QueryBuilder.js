import React, { Component } from 'react';
import Button from 'mui-next/Button'
import helper from '../../helper';
import { connect } from 'react-redux';
import InputSection from '../InputSection/InputSection'
import Typography from 'mui-next/Typography'
import Style from './QueryBuilder.css'

 var pathArr = [];

class QueryBuilder extends Component{
   constructor(props) {
        super(props);
        this.handleSubmitAll = this.handleSubmitAll.bind(this);
        // this.handleSend = this.handleSend.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // get initial data and set props
        var searchObj = {};
        this.state ={
            error: false, 
            errorMsg: ""
        }
    }
    handleClose(){ 
        // local validation
        this.setState({error: false, errorMsg: ""});
    }
 
    handleSubmitAll() {
        // clear message
        // array to store new paths
        pathArr = [];
        var myCourses = [];
        var hasCourses = false;
        var selectedCourses = [];
        if (this.props.selectedcourselist) selectedCourses.push(this.props.selectedcourselist);
        // A user will have no courses if courselist + selectedcouselist is empty 
        console.log("this.props.courselist", this.props.courselist)
        if ((this.props.courselist.length > 0) || (selectedCourses.length > 0)){
            hasCourses = true;
            if (((this.props.role.toUpperCase() === "TEACHER") || (this.props.role.toUpperCase() === "STUDENT")) && (selectedCourses.length === 0)){
                // send back all the teachers course - so that not all course are queried only all the teachers / students courses
                myCourses = Array.from(this.props.courselist);    
            } else if (this.props.selectedcourselist) {
                myCourses = Array.from(this.props.selectedcourselist); 
            } 
        } 
        // messy logic will rework later!!!
        /// if all good then send the query
        if (hasCourses){
            console.log("this.props.selectedtopiclist", this.props.selectedtopiclist)
            helper.getPathProjectAll(myCourses,this.props.selectedgradelist, this.props.selectedstandardslist, this.props.selectedtopiclist, this.props.selectedsubjectcontentlist, this.props.role, this.props.dispatch); 
            // reset display settings
            helper.addInitialRows("", this.props.dispatch);
        } else {
            this.setState({error: true , errorMsg:  "You have no COURSES set up in Sidekick, please contact your administrator."})
        }  
    }
    render(){
    
        var component = this;
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
                />
                <InputSection
                    header="enrolled in courses"
                    placeholder="Biology, English 10, U.S. History..."
                    value={this.props.selectedCourses}
                    data={this.props.potentialCourses}
                />
                <InputSection
                    header="will explore projects about"
                    placeholder="social justice, genetics, investing..."
                    value={this.props.selectedTopics}
                    data={this.props.potentialTopics}
                />
                <InputSection
                    header="while learning in subjects"
                    placeholder="math, science, english..."
                    value={this.props.selectedSubjects}
                    data={this.props.potentialSubjects}
                />
                <InputSection
                    header="that aligns to standards"
                    placeholder="CCSS-ELA, CCSS-Math, NGSS..."
                    value={this.props.selectedStandards}
                    data={this.props.potentialStandards}
                />           
                <Button
                    color="primary"
                    onClick={this.handleSubmitAll}
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
        selectedGrades: store.mainState.selectedgradelist,
        potentialGrades: store.mainState.gradelist,
        selectedCourses: store.mainState.selectedcourselist,
        potentialCourses: store.mainState.courselist,
        selectedTopics: store.mainState.selectedtopiclist,
        potentialTopics: store.mainState.topiclist,
        selectedSubjects: store.mainState.selectedsubjectcontentlist,
        potentialSubjects: store.mainState.subjectcontentlist,
        selectedStandards: store.mainState.selectedstandardslist,
        potentialStandards: store.mainState.standardslist,
        role: store.authState.role,
        username: store.authState.username,
        disabled: store.mainState.disabled,
        permissions:  store.authState.permissions,
    }
}

export default connect(mapStateToProps)(QueryBuilder);

