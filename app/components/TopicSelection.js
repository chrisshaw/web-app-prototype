import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import MultiSelectField from './MultiSelectField';
import ResetIcon from "./ResetIcon";

class TopicSelection extends Component{
   constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        // get initial data and set props
        helper.getTopics(false, false, this.props.dispatch);    
    }
    handleReset() {
        helper.getTopics(true, false, this.props.dispatch); 
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
        let hintText = "Select one or more topic(s) e.g. immigration";
        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float">will explore topics</p>
                        </Col>
                        <Col xs={2} md={2} >
                            <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>        
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <MultiSelectField hint={hintText} queryitem="Topics" list={this.props.topiclist} selectedlist={this.props.selectedtopiclist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}



const mapStateToProps = (store) => {
    return {
        topiclist: store.mainState.topiclist,
    }
}

export default connect(mapStateToProps)(TopicSelection);

