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
// import Github from 'material-ui/lib/svg-icons/custom/github';

class StandardsSelection extends Component{
   constructor(props) {
        super(props);
        // this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleShowGroups = this.handleShowGroups.bind(this);
        helper.getStandards(false, false, "",this.props.dispatch); 
        // get initial data and set props
        // helper.getStandards(this.props.dispatch);
        var searchObj = {};
        this.state ={
            showGroups: false
        }
    }
    // componentWillMount() {
    //     // reset chips and grouplist
    //     var dataSource1 = [];
    //     // this was moved out of the autocomplete to see if it speeds up large list
    //     if ((this.props.standardslist) && (this.props.standardslist[0] !== null)){
    //         dataSource1 = this.props.standardslist.map(function(group, index) {
    //             // strip out just the name for the autocomplete field
    //                     return group.name             
    //         })
    //     }
    //     this.setState({dataSource1: dataSource1})

    // }
    // // }
    // // handleRequestDelete(id) {
    //     // filter standardslist based on id
    //     helper.removeStandards(id, this.props.dispatch);
    // }
    handleReset() {
        helper.getStandards(true, false, "",this.props.dispatch); 
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
                            <AutoCompleteField queryitem="Standards" list={this.props.standardslist} selectedlist={this.props.selectedstandardslist} handleRequestDelete={this.handleRequestDelete}/>
                        </Col>
                    </Row>
                </div>
        )
    }
}



const mapStateToProps = (store) => {
    return {
        standardslist: store.mainState.standardslist,
        // selectedgradelist: store.mainState.selectedgradelist,
        // selectedstandardslist: store.mainState.selectedstandardslist,
    }
}

export default connect(mapStateToProps)(StandardsSelection);

