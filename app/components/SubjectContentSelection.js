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
// import Github from 'material-ui/lib/svg-icons/custom/github';

class SubjectContentSelection extends Component{
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
            groupState: "Open" 
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
        this.state.showGroups ?  this.setState({groupState: "Open"}) : this.setState({groupState: "Close"})
    }
    // getPaths(i) {
    //     // **TO HERE -- make this a promise cos then need to get paths
    //     // console.log("sending this to server", this.props.selectedgrouplist);
    //     // for (var i = 0; i < this.props.selectedgrouplist.length; i++){
    //     var component = this;
    //     if ((component.props.selectedgrouplist) && (component.props.selectedgrouplist.length !== 0)){
           
               
    //             console.log("i", i, "this.props.selectedgrouplist", this.props.selectedgrouplist);
    //             helper.getFAandGrade(this.props.selectedgrouplist, i, this.props.dispatch).then((i) => {
    //             //initially we have groups, fa and grade - in an array of objects - this.props.searchTerm
    //             // console.log("this.props.searchTerm wiht group name", this.props.initialSearchTerms);
    //             // just dealing with initial search for now\
    //             console.log("search terms begin sent", this.props.initialSearchTerms);
    //             // console.log(i);

    //             console.log(i)

    //             helper.getPaths(this.props.initialSearchTerms, i, this.props.dispatch).catch(function (error) {
    //                     console.log(error);
    //                 }).then(function(i){
                        
    //                     // console.log("i", i);
    //                     i++;
    //                     console.log("this.props.initialSearchTerms", component.props.selectedgrouplist.length);
    //                      if (i < component.props.selectedgrouplist.length){
    //                         console.log("recorsive call", i);
    //                         component.getPaths(i);

    //                      }
                    
    //                 })   
    //             })
            
           

    //     }
        
    
    // }


    render(){

        var styles = {
            button : {
                backgroundColor: '#9E9E9E'
            }
        }

       
        var component = this;
        if ( this.props.selectedgrouplist){
             var arrLength = this.props.selectedgrouplist.length;
        }
       
        return(<div><div className="query-builder-wrapper">
                    <Row>
                        <Col xs={2} md={2} >
                            <FlatButton style={styles.button} containerElement='label' label={this.state.groupState} onTouchTap={this.handleShowGroups} />
                        </Col>
                        <Col xs={10} md={10} >
                            <div className="auto-text-alignment">
                                <h4 className="chip-float">to learn content in </h4>
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
                                <FlatButton style={styles.button} containerElement='label' label="Reset Groups" onTouchTap={this.handleReset} />
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
        grouplist: store.mainState.grouplist,
        selectedgrouplist: store.mainState.selectedgrouplist,
        initialSearchTerms: store.mainState.initialSearchTerms,
    }
}

export default connect(mapStateToProps)(SubjectContentSelection);

