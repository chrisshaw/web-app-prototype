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

class GroupSelection extends Component{
   constructor(props) {
        super(props);
        // this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        // get initial data and set props
        helper.getGroups(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false, 
        }
    }
    // handleRequestDelete(id) {
    //     helper.removeGroup(id, this.props.dispatch);
    // }
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
        return(<div>
                    <Row>
                        <Col xs={10} md={10} >
                            <p className="search-text chip-float">Students in my groups (*)</p>
                        </Col>
                        <Col xs={2} md={2} >
                            <div className="reset-button text-center" onTouchTap={this.handleReset} ><ResetIcon className="reset-icon" /> Reset</div>        
                        </Col>                    
                    </Row>
                    <Row>
                        <Col xs={12} md={12} >
                            <AutoCompleteField queryitem="Groups" list={this.props.grouplist} selectedlist={this.props.selectedgrouplist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        grouplist: store.mainState.grouplist,
        // selectedgrouplist: store.mainState.selectedgrouplist,
    }
}

export default connect(mapStateToProps)(GroupSelection);

