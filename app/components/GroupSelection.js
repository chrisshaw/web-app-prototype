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
import ExpandMoreIcon from "./ExpandMoreIcon";
import ExpandLessIcon from "./ExpandLessIcon";
import ResetIcon from "./ResetIcon";

class GroupSelection extends Component{
   constructor(props) {
        super(props);
        // this.handleRemove = this.handleRemove.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        // this.getPaths = this.getPaths.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getGroups(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false, 
        }


    }
    handleRequestDelete(id) {
        helper.removeGroup(id, this.props.dispatch);
    }
    handleReset() {
        // reset chips and grouplist
        helper.getGroups(this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
    }
    render(){

        if ( this.props.selectedgrouplist){
             var arrLength = this.props.selectedgrouplist.length;
        }
       
        return(<div><div className="query-builder-wrapper">
                    <Row>
                        <Col xs={1} md={1} >
                            <div className={this.state.showGroups ? "hide" : "expand-icon"} onTouchTap={this.handleShowGroups}><ExpandMoreIcon /></div>
                            <div className={this.state.showGroups ? "expand-icon" : "hide"} onTouchTap={this.handleShowGroups}><ExpandLessIcon /></div>                       
                        </Col>
                        <Col xs={11} md={11} >
                            <div className="auto-text-alignment">
                                <p className="search-text chip-float"> Students in my groups</p>
                                <div className={this.state.showGroups ? "hide" : "expand-icon"} ><GroupChip className="text-center" style={{display: "inline"}} secondary={true} selectedgrouplist={this.props.selectedgrouplist} handleRequestDelete={this.handleRequestDelete}/> </div>
                            </div>                         
                        </Col>
                    </Row>
                </div>


                <div className={this.state.showGroups ? "query-builder-wrapper" : "query-builder-wrapper hide"} >
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteField  grouplist={this.props.grouplist} selectedgrouplist={this.props.selectedgrouplist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={8} md={8} >  
                            <p><strong>* this is a required field.</strong></p> 
                            <p><em>** select 'x' to remove individual groups from selected group list.</em></p> 
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
        grouplist: store.mainState.grouplist,
        selectedgrouplist: store.mainState.selectedgrouplist,
    }
}

export default connect(mapStateToProps)(GroupSelection);

