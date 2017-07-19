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

class GradeSelection extends Component{
   constructor(props) {
        super(props);
        // this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        // this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getGrades(false, false, this.props.dispatch);
        // var searchObj = {};
        // this.state ={
        //     showGroups: false, 
        // }
    }
    // handleRequestDelete(id) {
    //     helper.removeGroup(id, this.props.dispatch);
    // }

    // componentWillMount(){
    //     helper.getGrades(this.props.dispatch);     
    // }
    handleReset() {
        // reset chips and grouplist
        helper.getGrades(true, false, this.props.dispatch); 
    }
    // handleShowGroups() {
    //     // toggle between true and false
    //     this.setState({showGroups: !this.state.showGroups})
    // }
    render(){
        if ( this.props.selectedgradelist){
             var arrLength = this.props.selectedgradelist.length;
        }
        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float"> Students in my grades</p>
                        </Col>
                        <Col xs={2} md={2} >
                            <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>        
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteField queryitem="Grades" list={this.props.gradelist} selectedlist={this.props.selectedgradelist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        gradelist: store.mainState.gradelist,
    }
}

export default connect(mapStateToProps)(GradeSelection);

