import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import AutoCompleteField from './AutoCompleteField';
import CourseSelection from './CourseSelection';
import MultiSelectAutoCompleteField from './MultiSelectAutoCompleteField';
import GradeSelection from './GradeSelection';
import TopicSelection from './TopicSelection';
import SubjectContentSelection from './SubjectContentSelection';
import StandardsSelection from './StandardSelection';
import Dialog from 'material-ui/Dialog';

 var pathArr = [];

class QueryBuilder extends Component{
   constructor(props) {
        super(props);
        this.handleSubmitAll = this.handleSubmitAll.bind(this);
        // this.handleSend = this.handleSend.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // get initial data and set props
        // this.loadData(props);
        var searchObj = {};
        this.state ={
            error: false,
            errorMsg: ""
        }
    }

    componentWillMount() {
      helper.getGrades(false, false, this.props.dispatch);
      helper.getTopics(false, false, this.props.dispatch);
      console.log("QueryBuilder props: " + this.props);
      helper.getCourses(false,false,  this.props.username, this.props.role, this.props.dispatch);
      helper.getSubjectContents(false, false, this.props.dispatch);
      helper.getStandards(false, false, "",this.props.dispatch);
    }

    // componentWillMount() {
    //   console.log("will mount");
    //   helper.getCourses(false,false,  this.props.username, this.props.role, this.props.dispatch);
    // }

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
        const actions = [
            <FlatButton
                label="Close"
                onTouchTap={this.handleClose}
            />
            ];
        var styles = {
            dialog : {
                width: '50vw',
                position: 'absolute',
                left: '50vw',
                zIndex: 1500,
            }
        }

        var component = this;
        return(<div className="drawer-wrapper">
                <Row>
                    <Col xs={12} md={12} >
                        <div className="query-builder-wrapper">
                        <h3> Build Path </h3>
                        <p> Enter grade and other filter criteria below, then submit to get recommended paths. </p>
                        </div>
                    </Col>
                </Row>
                <Row>
                <Col xs={12} md={12} >
                    { (this.state.error ) ?  <Dialog
                        bodyStyle={{fontSize: 13}}
                        titleStyle={{fontSize: 14, fontWeight: 'bold'}}
                        title="PathBuilder Error"
                        actions={actions}
                        style={{zIndex: 2000,fontSize: 12, height: 300}}
                        modal={false}
                        open= {this.state.error}
                        onRequestClose={this.handleClose}
                        >
                     { this.state.errorMsg }
                        </Dialog> : " "}
                </Col>
                </Row>
                <div>
                  <Row>
                    <Col xs={10} md={10} >
                      <p className="search-text chip-float"> Students in grades</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={12} >
                      <MultiSelectAutoCompleteField
                        options={this.props.gradelist}
                        selectedOptions={this.props.selectedgradelist}
                        queryItem="Grades"
                        hintText="Select one or more student grade(s) e.g. 6" />
                    </Col>
                  </Row>
                </div>
                <div>
                            <Row>
                                <Col xs={10} md={10} >
                                    <p className="search-text chip-float"> who are enrolled in</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={12} >
                                <MultiSelectAutoCompleteField
                                  options={this.props.courselist}
                                  selectedOptions={this.props.selectedcourselist}
                                  queryItem="Courses"
                                  hintText="Select one or more course(s) e.g. Biology"/>
                                </Col>
                            </Row>
                        </div>
                        <div>
                                    <Row>
                                        <Col xs={10} md={10} >
                                            <p className="search-text chip-float">will explore topics</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={12} >
                                            <MultiSelectAutoCompleteField
                                              options={this.props.topiclist}
                                              selectedOptions={this.props.selectedtopiclist}
                                              queryItem="Topics"
                                              hintText="Select one or more topic(s) e.g. immigration" />
                                        </Col>
                                    </Row>
                                </div>
                                <div>
                                            <Row>
                                                <Col xs={10} md={10} >
                                                    <p className="search-text chip-float">while learning content in</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={12} md={12} >
                                                <MultiSelectAutoCompleteField
                                                options={this.props.subjectcontentlist}
                                                selectedOptions={this.props.selectedsubjectcontentlist}
                                                queryItem="Subjects"
                                                hintText="Select one or more subject(s) e.g. english, math" />
                                                </Col>
                                            </Row>
                                        </div>
                                        <div>
                                                    <Row>
                                                        <Col xs={10} md={10} >
                                                            <p className="search-text chip-float">that aligns to standards</p>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs={12} md={12} >
                                                        <MultiSelectAutoCompleteField
                                                          options={this.props.standardslist}
                                                          selectedOptions={this.props.selectedstandardslist}
                                                          queryItem="Standards"
                                                          hintText="Select one or more standard(s)" />
                                                        </Col>
                                                    </Row>
                                                </div>
                <Row>
                    <Col xs={12} md={12} className="text-center" >
                        <FlatButton containerElement='label' label="Get Recommended Paths" onTouchTap={this.handleSubmitAll} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} className="text-center" >
                        { (this.props.perms) && (this.props.perms.indexOf('publish') !== -1) ? <FlatButton containerElement='label' label="Start Publishing to LMS" disabled={this.props.disabled} onTouchTap={this.props.handleSend} /> : ""}
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
      role: store.authState.role,
      username: store.authState.username,
        gradelist: store.mainState.gradelist,
        courselist: store.mainState.courselist,
        topiclist: store.mainState.topiclist,
        subjectcontentlist: store.mainState.subjectcontentlist,
        standardslist: store.mainState.standardslist,
        selectedgrouplist: store.mainState.selectedgrouplist,
        selectedgradelist: store.mainState.selectedgradelist,
        selectedcourselist: store.mainState.selectedcourselist,
        selectedtopiclist: store.mainState.selectedtopiclist,
        selectedstandardslist: store.mainState.selectedstandardslist,
        selectedsubjectcontentlist: store.mainState.selectedsubjectcontentlist,
        disabled: store.mainState.disabled,
        perms:  store.authState.perms,
    }
}

export default connect(mapStateToProps)(QueryBuilder);
