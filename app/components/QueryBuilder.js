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
        this.getPaths = this.getPaths.bind(this);
        // get initial data and set props
        helper.getGroups(this.props.dispatch);
        var searchObj = {};
 
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
    getPaths() {
        // **TO HERE -- make this a promise cos then need to get paths
        helper.getFAandGrade(this.props.selectedgrouplist, this.props.dispatch).then(() => {
            //initially we have groups, fa and grade - in an array of objects - this.props.searchTerm
            console.log("this.props.searchTerm wiht group name", this.props.initialSearchTerms);
            // just dealing with initial search for now
            helper.getPaths(this.props.initialSearchTerms, this.props.dispatch); 
        }); 
    
    }
    render(){
        var component = this;
        return(<div>
                <div className="query-builder-wrapper">
                <h3> Build Path </h3>
                <p> Enter required criteria and submit to get reccommended paths. Or some other blurb...</p> 
                </div>
                <div className="query-builder-wrapper">
                <Row>
                    <Col xs={12} md={12} >
                        <h4> Students in my groups:</h4>
                        <div className="auto-text-alignment">
                            <GroupChip className="text-center" style={{display: "inline"}} secondary={true} selectedgrouplist={this.props.selectedgrouplist} handleRemove={this.handleRemove} handleRequestDelete={this.handleRequestDelete}/>
                            <AutoCompleteField style={{display: "inline"}} grouplist={component.props.grouplist} selectedgrouplist={component.props.selectedgrouplist}/>
                        </div>
                        <p><em>* select 'x' to remove any groups that are not required.</em></p>

                    </Col>
                    <Col xs={12} md={12} >
                        <FlatButton containerElement='label' label="Reset Groups" onTouchTap={this.handleReset} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} className="text-center" >
                        <FlatButton containerElement='label' label="Get Reccommended Paths" onTouchTap={this.getPaths} />
                    </Col>
                </Row>
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
        initialSearchTerms: store.mainState.initialSearchTerms,
    }
}

export default connect(mapStateToProps)(QueryBuilder);

