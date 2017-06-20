import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import TopicChip from './TopicChip';
import AutoCompleteTopicField from './AutoCompleteTopicField';
import ExpandMoreIcon from "./ExpandMoreIcon";
import ExpandLessIcon from "./ExpandLessIcon";
import ResetIcon from "./ResetIcon";

class TopicSelection extends Component{
   constructor(props) {
        super(props);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        // helper.getGroups(this.props.dispatch);
        helper.getTopics(this.props.dispatch);    
        var searchObj = {};
        // state for hide/show selection and text/icon
        this.state ={
            showGroups: false, 
            // groupState: "Open" 
        }
    }
    handleRequestDelete(id) {
        // filter topic based on id
        helper.removeTopic(id, this.props.dispatch);
    }
    handleReset() {
        helper.getTopics(this.props.dispatch); 
        // console.log("getting topics", this.props.topiclist);

    }
    handleShowGroups() {
        // toggle between true and false and change the displayed message
        this.setState({showGroups: !this.state.showGroups})
        // this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }
    render(){
        var styles = {
            button : {
                // backgroundColor: '#9E9E9E'
            }
        }  
        // console.log("topiclist", this.props.topiclist)
        var component = this;
        if ( this.props.selectedtopiclist){
             var arrLength = this.props.selectedtopiclist.length;
        }
       
        return(<div><div className="query-builder-wrapper">
                    <Row>
                        <Col xs={1} md={1} >

                            <div className={this.state.showGroups ? "hide" : "expand-icon"} onTouchTap={this.handleShowGroups}><ExpandMoreIcon /></div>
                            <div className={this.state.showGroups ? "expand-icon" : "hide"} onTouchTap={this.handleShowGroups}><ExpandLessIcon /></div>
                         
                        </Col>
                        <Col xs={11} md={11} >
                            <div className="auto-text-alignment">
                                <p className="search-text chip-float"> will explore</p>
                                <div className={this.state.showGroups ? "hide" : "expand-icon"} ><TopicChip className="text-center" style={{display: "inline"}} secondary={true} selectedtopiclist={this.props.selectedtopiclist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/></div> 
                            </div>
                            
                        </Col>
                    </Row>
                </div>


                <div className={this.state.showGroups ? "query-builder-wrapper" : "query-builder-wrapper hide"} >
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteTopicField  topiclist={component.props.topiclist} selectedtopiclist={component.props.selectedtopiclist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>              
                    </Row>
                    <Row>
                       <Col xs={8} md={8} >  
                            <p><em>** select 'x' to remove individual topics from selected topics list.</em></p> 
                        </Col>
                        <Col xs={4} md={4} >  
                         <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>
                        </Col> 
                    </Row>
                </div>
                </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        topiclist: store.mainState.topiclist,
        selectedtopiclist: store.mainState.selectedtopiclist,
        // initialSearchTerms: store.mainState.initialSearchTerms,
    }
}

export default connect(mapStateToProps)(TopicSelection);

