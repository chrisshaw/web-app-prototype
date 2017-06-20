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
            // groupState: "Open" 
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
        // this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }


    render(){

        var styles = {
            button : {
                // backgroundColor: '#9E9E9E'
            }
        }

       
        var component = this;
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
                                <GroupChip className="text-center" style={{display: "inline"}} secondary={true} selectedgrouplist={this.props.selectedgrouplist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/> 
                            </div>
                            
                        </Col>
                    </Row>
                </div>


                <div className={this.state.showGroups ? "query-builder-wrapper" : "query-builder-wrapper hide"} >
                    <Row>
                        <Col xs={12} md={6} >
                            <AutoCompleteField  grouplist={component.props.grouplist} selectedgrouplist={component.props.selectedgrouplist}/>
                        </Col>
                        <Col xs={12} md={6} > 
                            <div className='drawer-button-wrapper'> 
                                <div className="reset-button" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>
                            </div>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >  
                            <p><strong>* this is a required field.</strong></p> 
                            <p><em>** select 'x' to remove individual groups from selected group list.</em></p> 
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
        // initialSearchTerms: store.mainState.initialSearchTerms,
    }
}

export default connect(mapStateToProps)(GroupSelection);

