import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import MultiSelectField from './MultiSelectField';

class SubjectContentSelection extends Component{
   constructor(props) {
        super(props);
        // this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getSubjectContents(false, false, this.props.dispatch);     
        var searchObj = {};
        this.state ={
            showGroups: false, 
        }

   }
    // handleRequestDelete(id) {
    //     console.log("remove subject from selected list", id)
    //     helper.removeSubject(id, this.props.dispatch);
    // }
    handleReset() {
        helper.getSubjectContents(true, false, this.props.dispatch); 
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
        let hintText = "Select one or more subject(s) e.g. english, math";
        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float">while learning content in</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <MultiSelectField hint={hintText} queryitem="Subjects" list={this.props.subjectcontentlist} selectedlist={this.props.selectedsubjectcontentlist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        subjectcontentlist: store.mainState.subjectcontentlist,
        // selectedsubjectcontentlist: store.mainState.selectedsubjectcontentlist,
    }
}

export default connect(mapStateToProps)(SubjectContentSelection);

