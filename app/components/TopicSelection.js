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

class TopicSelection extends Component{
   constructor(props) {
        super(props);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getTopics(this.props.dispatch);    
        var searchObj = {};
        // state for hide/show selection and text/icon
        this.state ={
            showGroups: false, 
        }
    }
    handleRequestDelete(id) {
        // filter topic based on id
        helper.removeTopic(id, this.props.dispatch);
    }
    handleReset() {
        helper.getTopics(this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false and change the displayed message
        this.setState({showGroups: !this.state.showGroups});
    }
    render(){
        var styles = {
            button : {
            }
        }  
        var component = this;
        if ( this.props.selectedtopiclist){
             var arrLength = this.props.selectedtopiclist.length;
        }
       

        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float">will explore</p>
                        </Col>
                        <Col xs={2} md={2} >
                            <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>        
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteField queryitem="Topics" list={this.props.topiclist} selectedlist={this.props.selectedtopiclist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}



const mapStateToProps = (store) => {
    return {
        topiclist: store.mainState.topiclist,
        selectedtopiclist: store.mainState.selectedtopiclist,
    }
}

export default connect(mapStateToProps)(TopicSelection);

