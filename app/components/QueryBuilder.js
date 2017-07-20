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
        // this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleSubmitAll = this.handleSubmitAll.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        // get initial data and set props
        // helper.getGroups(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false, 
            // nogoupselected: false,   
        }
    }
   componentDidUpdate(prevProps, prevState){
       // needed to trigger requery if grade changes    
        if ((prevProps.selectedgradelist !== this.props.selectedgradelist) && (prevProps.selectedgradelist)){
            // could equally  just pass this.props and retrieve in helper??
            helper.getCourses(false, false, this.props.selectedgradelist, this.props.username, this.props.dispatch); 
            helper.getStandards(false, false, this.props.selectedgradelist, this.props.dispatch);     
        }    
    }
    // handleRequestDelete(id) {
    //     // filter grouplist based on id
    //     helper.removeGroup(id, this.props.dispatch);     
    // }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
        this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }
    // handleClose = () => {
    //     this.setState({nogoupselected: false});
    // };
    handleSubmitAll() {
        // clear message
        // helper.pathsRendered(false, this.props.dispatch);
        helper.newPaths("", this.props.dispatch);
        // array to store new paths
        pathArr = [];
        var myCourses = [];
   
        //  console.log("myCourses", myCourses);
        if (((this.props.role.toUpperCase() === "TEACHER") || (this.props.role.toUpperCase() === "STUDENT")) && (!this.props.selectedcourselist)){
            // send back all the teachers course - so that not all course are queried only all the teachers / students courses
            console.log("role", this.props.role.toUpperCase()); 
            myCourses = Array.from(this.props.courselist);      
            // myCourses.push(this.props.courselist);
            console.log("myCourses", myCourses)
        } else if (this.props.selectedcourselist) {
            myCourses = Array.from(this.props.selectedcourselist);      
            //  myCourses.push(this.props.selectedcourselist);
        } 
        console.log("myCourses", myCourses)
       
        helper.getPathsAll(myCourses,this.props.selectedgradelist, this.props.selectedstandardslist, this.props.selectedtopiclist, this.props.selectedsubjectcontentlist, this.props.role, this.props.dispatch);  
    }
    render(){
        // const actions = [
        //     <FlatButton
        //         label="Close"
        //         onTouchTap={this.handleClose}
        //     />
        //     ];
//   console.log("role", this.props.role)
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
        // pathsrendered: store.mainState.pathsrendered
    }
}

export default connect(mapStateToProps)(QueryBuilder);

