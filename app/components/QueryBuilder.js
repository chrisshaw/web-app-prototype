import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import GroupChip from './GroupChip';
import AutoCompleteField from './AutoCompleteField';
import GroupSelection from './GroupSelection';
import TopicSelection from './TopicSelection';
import SubjectContentSelection from './SubjectContentSelection';
import StandardsSelection from './StandardSelection';
import TimeLineSelection from './TimeLineSelection';
import Dialog from 'material-ui/Dialog';


class QueryBuilder extends Component{
   constructor(props) {
        super(props);
        // this.handleRemove = this.handleRemove.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.getPaths = this.getPaths.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // get initial data and set props
        helper.getGroups(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false, 
            // groupState: "Open" 
            nogoupselected: false,
            // nopathreturned: false
        }
 
        // next
        // helper.getGroupFA(this.props.dispatch);

    }
    // handleRemove() {
    //     // action triggered when a chip is deleted - must remove from the prop by sending update to the store
    //     console.log("in handle remove");
    //     // helper.editGroupsList(groupid, this.props.dispatch)
    // }
    handleRequestDelete(id) {
        // console.log("id of group for delete", id);
        // filter grouplist based on id
        // console.log(this)
        helper.removeGroup(id, this.props.dispatch);
       
    }
    handleReset() {
        // console.log("in reset");
        helper.getGroups(this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
        this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }
    handleClose = () => {
        this.setState({nogoupselected: false});
    };
    getPaths(i) {
        // **TO HERE -- make this a promise cos then need to get paths
        // console.log("sending this to server", this.props.selectedgrouplist);
        // for (var i = 0; i < this.props.selectedgrouplist.length; i++){
        var component = this;
        if ((component.props.selectedgrouplist) && (component.props.selectedgrouplist.length !== 0)){
           
               
                // console.log("i", i, "this.props.selectedgrouplist", this.props.selectedgrouplist);
                // (selectedGroups, selectedStandards, selectedTopics, selectedSubjects, i, dispatch)
                helper.getFAandGrade(this.props.selectedgrouplist, this.props.selectedstandardslist, this.props.selectedtopiclist, this.props.selectedsubjectcontentlist, i, this.props.dispatch).then((i) => {
                //initially we have groups, fa and grade - in an array of objects - this.props.searchTerm
      
                helper.getPaths(this.props.initialSearchTerms, i, this.props.dispatch).catch(function (error) {
                        console.log(error);
                    }).then(function(i){
                        
                        // console.log("i", i);
                        i++;
                        // console.log("this.props.initialSearchTerms", component.props.selectedgrouplist.length);
                         if (i < component.props.selectedgrouplist.length){
                            // console.log("recorsive call", i);
                            component.getPaths(i);

                         } 
                    
                    })   
                })
            
           

        } else {
            // no group selected message
            this.setState({nogoupselected: true})
        }
        // if nothing found
        // if ((i === component.props.selectedgrouplist.length) && (noPaths === component.props.selectedgrouplist.length-1)) {
        //     component.setState({nopathreturned: true})
        //     console.log("no paths!", this.props.paths);
        // }
        
    
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
       
        return(<div>
                <Row>
                    <Col xs={12} md={12} >
                        <div className="query-builder-wrapper">
                        <h3> Build Path </h3>
                        <p> Enter Groups and filter criteria below and submit to get reccommended paths. </p> 
                        </div>
                    </Col>
                </Row>
                <Row>
                <Dialog
              
                title="No Group Selected"
                actions={actions}
                style={{zIndex: 2000}}
                modal={false}
                open={this.state.nogoupselected}
                onRequestClose={this.handleClose}
                >
                   Please select at least one Group option.
                    </Dialog>

                </Row>
                <GroupSelection />
                <TopicSelection />
                <SubjectContentSelection />
                <StandardsSelection />

                <Row>
                    <Col xs={12} md={12} className="text-center" >            
                        <FlatButton containerElement='label' label="Get Reccommended Paths" onTouchTap={() => this.getPaths(0)} />
                    </Col>
                </Row>
      
            </div>
        )
    }
}



const mapStateToProps = (store,ownProps) => {
    return {
        grouplist: store.mainState.grouplist,
        selectedgrouplist: store.mainState.selectedgrouplist,
        topiclist: store.mainState.topiclist,
        selectedtopiclist: store.mainState.selectedtopiclist,
        initialSearchTerms: store.mainState.initialSearchTerms,
        selectedstandardslist: store.mainState.selectedstandardslist, 
        selectedsubjectcontentlist: store.mainState.selectedsubjectcontentlist,
    }
}

export default connect(mapStateToProps)(QueryBuilder);

