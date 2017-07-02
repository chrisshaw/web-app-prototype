import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import AutoCompleteField from './AutoCompleteField';
import GroupSelection from './GroupSelection';
import TopicSelection from './TopicSelection';
import SubjectContentSelection from './SubjectContentSelection';
import StandardsSelection from './StandardSelection';
import Dialog from 'material-ui/Dialog';

 var pathArr = [];

class QueryBuilder extends Component{
   constructor(props) {
        super(props);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleSubmitAll = this.handleSubmitAll.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // get initial data and set props
        helper.getGroups(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false, 
            nogoupselected: false,   
        }
    }
    handleRequestDelete(id) {
        // filter grouplist based on id
        helper.removeGroup(id, this.props.dispatch);     
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
        this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }
    handleClose = () => {
        this.setState({nogoupselected: false});
    };
    // new to be tested
    handleSubmitAll() {
        // clear message
        helper.pathsRendered(false, this.props.dispatch);
        if (this.props.selectedgrouplist.length !== 0) {
            // this.props.closeDrawer();
            // clear old paths
            var paths = "";
            helper.newPaths(paths, this.props.dispatch);
            // array to store new paths
            pathArr = [];
            helper.getPathsAll(this.props.selectedgrouplist, this.props.selectedstandardslist, this.props.selectedtopiclist, this.props.selectedsubjectcontentlist, this.props.dispatch);
       } else {
            // no group selected message
            this.setState({nogoupselected: true})
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
        if ( this.props.selectedgrouplist){
             var arrLength = this.props.selectedgrouplist.length;
        }

        return(<div className="query-builder-wrapper">
                <Row>
                    <Col xs={12} md={12} >
                        <div className="query-builder-wrapper">
                        <h3> Build Path </h3>
                        <p> Enter groups and other filter criteria below, then submit to get reccommended paths. </p> 
                        </div>
                    </Col>
                </Row>
                <Row>
                <Dialog className={this.state.nogoupselected ? "" : "hide"}
                    bodyStyle={{fontSize: 13}}
                    titleStyle={{fontSize: 14, fontWeight: 'bold'}}
                    title="No Group Selected"
                    actions={actions}
                    style={{zIndex: 2000,fontSize: 12, height: 300, width: 350, left: 60}}
                    modal={false}
                    open={this.state.nogoupselected}
                    onRequestClose={this.handleClose}
                >
                   <p>Please select at least one Group option.</p>
                    </Dialog>
                </Row>
                <GroupSelection selectedgrouplist={this.props.selectedgrouplist}/>
                <TopicSelection selectedtopiclist={this.props.selectedtopiclist}/>
                <SubjectContentSelection selectedsubjectcontentlist={this.props.selectedsubjectcontentlist}/>
                <StandardsSelection  selectedstandardslist={this.props.selectedstandardslist}/>              
                <Row>
                    <Col xs={12} md={12} className="text-center" >            
                        <FlatButton containerElement='label' label="Get Reccommended Paths" onTouchTap={this.handleSubmitAll} />
                    </Col>
                </Row>
                {this.props.pathsrendered ? (<Row>
                    <Col xs={12} md={12} >
                        <div className="query-builder-wrapper">
                        <p className="text-center"><em className="paths-returned"> Path Results Returned </em></p> 
                        </div>
                    </Col>
                </Row>) : "" } 
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        selectedgrouplist: store.mainState.selectedgrouplist,
        selectedtopiclist: store.mainState.selectedtopiclist,
        initialSearchTerms: store.mainState.initialSearchTerms,
        selectedstandardslist: store.mainState.selectedstandardslist, 
        selectedsubjectcontentlist: store.mainState.selectedsubjectcontentlist,
        pathsrendered: store.mainState.pathsrendered
    }
}

export default connect(mapStateToProps)(QueryBuilder);

