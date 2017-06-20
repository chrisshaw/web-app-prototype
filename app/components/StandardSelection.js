import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import helper from '../helper';
import {connect} from 'react-redux';
import StandardsChip from './StandardsChip';
import AutoCompleteStandardsField from './AutoCompleteStandardsField';
import ExpandMoreIcon from "./ExpandMoreIcon";
import ExpandLessIcon from "./ExpandLessIcon";
import ResetIcon from "./ResetIcon";
// import Github from 'material-ui/lib/svg-icons/custom/github';

class StandardsSelection extends Component{
   constructor(props) {
        super(props);
        // this.handleRemove = this.handleRemove.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        // this.getPaths = this.getPaths.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getStandards(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false, 
            // groupState: "Open" 
        }
 
        // next
        // helper.getGroupFA(this.props.dispatch);

    }
    componentWillMount(){
        helper.getStandards(this.props.dispatch);     
    }
    // handleRemove() {
    //     // action triggered when a chip is deleted - must remove from the prop by sending update to the store
    //     console.log("in handle remove");
    //     // helper.editGroupsList(groupid, this.props.dispatch)
    // }
    handleRequestDelete(id) {
        // console.log("id of group for delete", id);
        // filter standardslist based on id
        // console.log(this)
        helper.removeStandards(id, this.props.dispatch);
    }
    handleReset() {
        // console.log("in reset");
        helper.getStandards(this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
        // this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }
    render(){

        var styles = {
            button : {
                backgroundColor: '#9E9E9E'
            }
        }

       
        var component = this;
        // console.log("standardslist", this.props.standardslist)
        if ( this.props.selectedstandardslist){
             var arrLength = this.props.selectedstandardslist.length;
        }
       
        return(<div><div className="query-builder-wrapper">
                    <Row>
                       <Col xs={1} md={1} >

                            <div className={this.state.showGroups ? "hide" : "expand-icon"} onTouchTap={this.handleShowGroups}><ExpandMoreIcon /></div>
                            <div className={this.state.showGroups ? "expand-icon" : "hide"} onTouchTap={this.handleShowGroups}><ExpandLessIcon /></div>
                         
                        </Col>
                        <Col xs={11} md={11} >
                            <div className="auto-text-alignment">
                                <p className="search-text chip-float">that aligns to </p>
                                <div className={this.state.showGroups ? "hide" : "expand-icon"} ><StandardsChip className="text-center" style={{display: "inline"}} secondary={true} selectedstandardslist={this.props.selectedstandardslist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/></div>
                            </div>
                            
                        </Col>
                    </Row>
                </div>


                <div className={this.state.showGroups ? "query-builder-wrapper" : "query-builder-wrapper hide"} >
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteStandardsField standardslist={component.props.standardslist} selectedstandardslist={component.props.selectedstandardslist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/>
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
        standardslist: store.mainState.standardslist,
        selectedstandardslist: store.mainState.selectedstandardslist,
        // initialSearchTerms: store.mainState.initialSearchTerms,
    }
}

export default connect(mapStateToProps)(StandardsSelection);

