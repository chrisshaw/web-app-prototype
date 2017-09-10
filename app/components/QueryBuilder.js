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
        }  else {
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
                        <p> Enter grade and other filter criteria below, then submit to get reccommended paths. </p> 
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
                <GradeSelection selectedgradelist={this.props.selectedgradelist}/>
                <CourseSelection selectedcourselist={this.props.selectedcourselist} role={this.props.role} username={this.props.username}/>
                <TopicSelection selectedtopiclist={this.props.selectedtopiclist}/>
                <SubjectContentSelection selectedsubjectcontentlist={this.props.selectedsubjectcontentlist}/>
                <StandardsSelection  selectedstandardslist={this.props.selectedstandardslist}/>              
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
        selectedgrouplist: store.mainState.selectedgrouplist,
        selectedgradelist: store.mainState.selectedgradelist,
        selectedcourselist: store.mainState.selectedcourselist,
        courselist: store.mainState.courselist,
        selectedtopiclist: store.mainState.selectedtopiclist,
        selectedstandardslist: store.mainState.selectedstandardslist, 
        selectedsubjectcontentlist: store.mainState.selectedsubjectcontentlist,
        role: store.authState.role,
        username: store.authState.username,
        disabled: store.mainState.disabled,
        perms:  store.authState.perms,
    }
}

export default connect(mapStateToProps)(QueryBuilder);

