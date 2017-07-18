import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import AutoCompleteField from './AutoCompleteField';
import ResetIcon from "./ResetIcon";

class CourseSelection extends Component{
   constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        var searchObj = {};
        this.state ={
            showGroups: false, 
        }
    }
    handleReset() {
        // reset chips and grouplist
        helper.getCourses(true, false,"",this.props.dispatch); 
    }
    componentWillMount() {
        // reset chips and grouplist
        helper.getCourses(false,false, "",this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
    }
    render(){
        console.log("in here course")
        if ( this.props.selectedcourselist){
             var arrLength = this.props.selectedcourselist.length;
        }
        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float"> in my courses</p>
                        </Col>
                        <Col xs={2} md={2} >
                            <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>        
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteField queryitem="Courses" list={this.props.courselist} selectedlist={this.props.selectedcourselist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        courselist: store.mainState.courselist,
        // selectedgradelist: store.mainState.selectedgradelist,
    }
}

export default connect(mapStateToProps)(CourseSelection);

