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

class SubjectContentSelection extends Component{
   constructor(props) {
        super(props);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getSubjectContents(this.props.dispatch);     
        var searchObj = {};
        this.state ={
            showGroups: false, 
        }

   }
    handleRequestDelete(id) {
        console.log("remove subject from selected list", id)
        helper.removeSubject(id, this.props.dispatch);
    }
    handleReset() {
        helper.getSubjectContents(this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
    }
    render(){

        var styles = {
            button : {
            }
        }
    
        var component = this;
        if ( this.props.selectedsubjectcontentlist){
             var arrLength = this.props.selectedsubjectcontentlist.length;
        }    
        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float">to learn content in</p>
                        </Col>
                        <Col xs={2} md={2} >
                            <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>        
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteField queryitem="Subjects" list={this.props.subjectcontentlist} selectedlist={this.props.selectedsubjectcontentlist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        subjectcontentlist: store.mainState.subjectcontentlist,
        selectedsubjectcontentlist: store.mainState.selectedsubjectcontentlist,
    }
}

export default connect(mapStateToProps)(SubjectContentSelection);

