import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import SubjectContentChip from './SubjectContentChip';
import AutoCompleteSubjectField from './AutoCompleteSubjectField';
import ExpandMoreIcon from "./ExpandMoreIcon";
import ExpandLessIcon from "./ExpandLessIcon";
import ResetIcon from "./ResetIcon";

class SubjectContentSelection extends Component{
   constructor(props) {
        super(props);
        // this.handleRemove = this.handleRemove.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        // this.getPaths = this.getPaths.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getSubjectContents(this.props.dispatch);     
        var searchObj = {};
        this.state ={
            showGroups: false, 
            // groupState: "Open" 
        }

   }
    handleRequestDelete(id) {
        console.log("remove subject from selected list", id)
        helper.removeSubject(id, this.props.dispatch);
    }
    handleReset() {
        // console.log("in reset");
        helper.getSubjectContents(this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
        // this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }
    render(){

        var styles = {
            button : {
                // backgroundColor: '#9E9E9E'
            }
        }
    
        var component = this;
            //  console.log("subjectcontentlist", this.props.subjectcontentlist)

        // console.log("selectedsubjectcontentlist", this.props.selectedsubjectcontentlist)
        if ( this.props.selectedsubjectcontentlist){
             var arrLength = this.props.selectedsubjectcontentlist.length;
        }
       
        return(<div><div className="query-builder-wrapper">
                    <Row>
                        <Col xs={1} md={1} >

                            <div className={this.state.showGroups ? "hide" : "expand-icon"} onTouchTap={this.handleShowGroups}><ExpandMoreIcon /></div>
                            <div className={this.state.showGroups ? "expand-icon" : "hide"} onTouchTap={this.handleShowGroups}><ExpandLessIcon /></div>
                         
                        </Col>
                        <Col xs={11} md={11} >
                            <div className="auto-text-alignment">
                                <p className="search-text chip-float">to learn content in </p>
                                <SubjectContentChip className="text-center" style={{display: "inline"}} secondary={true} selectedsubjectcontentlist={this.props.selectedsubjectcontentlist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/> 
                            </div>
                            
                        </Col>
                    </Row>
                </div>


                <div className={this.state.showGroups ? "query-builder-wrapper" : "query-builder-wrapper hide"} >
                    <Row>
                        <Col xs={12} md={6} >
                            <AutoCompleteSubjectField  subjectcontentlist={component.props.subjectcontentlist} selectedsubjectcontentlist={component.props.selectedsubjectcontentlist}/>
                        </Col>
                        <Col xs={12} md={6} > 
                            <div className='drawer-button-wrapper'> 
                                <div className="reset-button" onTouchTap={this.handleReset} ><ResetIcon /> Reset</div>
                            </div>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >  
                            <p><em>* select 'x' to remove any groups that are not required.</em></p> 
                        </Col>
                    </Row>
                </div>
                </div>
        )
    }
}

const mapStateToProps = (store,ownProps) => {
    return {
        subjectcontentlist: store.mainState.subjectcontentlist,
        selectedsubjectcontentlist: store.mainState.selectedsubjectcontentlist,
        initialSearchTerms: store.mainState.initialSearchTerms,
    }
}

export default connect(mapStateToProps)(SubjectContentSelection);

