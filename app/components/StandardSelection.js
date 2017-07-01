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
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getStandards(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false, 
        }
    }
    componentWillMount(){
        helper.getStandards(this.props.dispatch);     
    }
    handleRequestDelete(id) {
        // filter standardslist based on id
        helper.removeStandards(id, this.props.dispatch);
    }
    handleReset() {
        helper.getStandards(this.props.dispatch); 
    }
    handleShowGroups() {
        // toggle between true and false
        this.setState({showGroups: !this.state.showGroups})
    }
    render(){

        var styles = {
            button : {
                backgroundColor: '#9E9E9E'
            }
        } 
        var component = this;
        if ( this.props.selectedstandardslist){
             var arrLength = this.props.selectedstandardslist.length;
        }
       
        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float">that aligns to</p>
                        </Col>
                        <Col xs={2} md={2} >
                            <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>        
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteStandardsField standardslist={this.props.standardslist} selectedstandardslist={this.props.selectedstandardslist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}



const mapStateToProps = (store) => {
    return {
        standardslist: store.mainState.standardslist,
        selectedstandardslist: store.mainState.selectedstandardslist,
    }
}

export default connect(mapStateToProps)(StandardsSelection);

