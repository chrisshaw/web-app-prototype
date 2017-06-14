import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import helper from '../helper';
import {connect} from 'react-redux';
import GroupChip from './GroupChip';
import AutoCompleteField from './AutoCompleteField';

class QueryBuilder extends Component{
   constructor(props) {
        super(props);
        // this.handleRemove = this.handleRemove.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleReset = this.handleReset.bind(this);
        // get initial data and set props
        helper.getGroups(this.props.dispatch);

        console.log("selected groups", this.props);
        console.log("all groups", this.props);
        // next
        // helper.getGroupFA(this.props.dispatch);

    }
    // handleRemove() {
    //     // action triggered when a chip is deleted - must remove from the prop by sending update to the store
    //     console.log("in handle remove");
    //     // helper.editGroupsList(groupid, this.props.dispatch)
    // }
    handleRequestDelete(id) {
        console.log("id of group for delete", id);
        // filter grouplist based on id
        // console.log(this)
        helper.removeGroup(id, this.props.dispatch);
    }
    handleReset() {
        // console.log("in reset");
        helper.getGroups(this.props.dispatch); 
    }
    render(){
//  console.log("selected groups", this.props);
//         console.log("all groups", this.props);
        var component = this;
        return(<div>
                <div className="query-builder-wrapper">
                <h3> Build Path </h3>
                <p> Enter required criteria and submit to get reccommended paths. Or some other blurb...</p> 
                </div>
                <div className="query-builder-wrapper">
                <Col xs={8} md={8} >
                    <h4> Students in my groups:</h4> 
                    <GroupChip className="text-center" secondary={true} selectedgrouplist={this.props.selectedgrouplist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/>
                    <AutoCompleteField grouplist={component.props.grouplist} selectedgrouplist={component.props.selectedgrouplist}/>
                    <p><em>* select 'x' to remove any groups that are not required.</em></p>
                </Col>
                <Col className="reset-button text-center" xs={4} md={4} > 
                    <FlatButton containerElement='label' label="Reset Groups" onTouchTap={this.handleReset} />
                </Col>
                </div>
            </div>
        )
    }
}

// export default PathBuilder;

const mapStateToProps = (store,ownProps) => {
    return {
        grouplist: store.mainState.grouplist,
        selectedgrouplist: store.mainState.selectedgrouplist,
    }
}

export default connect(mapStateToProps)(QueryBuilder);

