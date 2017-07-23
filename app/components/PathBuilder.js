import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import GroupTabs from './GroupTabs';


const style = {
    drawer: {
        zIndex: 100,
        position: 'fixed',
        top: '300px'
    },
    span: {
        color: '#FFFFFF',
    
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
        fontColor: '#FFFFFF',
        mariginLeft: '10px'

    },
    paper: {
        width: '100%',
        textAlign: 'center',
        overflow: 'auto'
    }
}

class PathBuilder extends Component{
   constructor(props) {
        super(props);
        // this.handleClose = this.handleClose.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    
    // handleClose(){
    //     helper.toggleDrawer(false, this.props.dispatch);
    // }
    handleSend() {
        // used by the "send to Sidekick" button in QueryBuilder
        helper.sendToSummit(this.props.paths)  
    }
    // componentWillMount(){
    //     // set this.props.build === true so that title is not displayed and appbar is more responsive for
    //     // this page on smalle screens
    //     // helper.showView(true, this.props.dispatch);
    // }
    // shouldComponentUpdate(nextProps, nextState){
    //     // if ((this.props != nextProps) && (this.props.changed !== false)){
    //         if (nextProps.changed !== false)  return true
    //         console.log("in if thisprops", this.props)
           
    //     // }
       
    // }
    render(){
        console.log("What aer thsesese/", this.props)
        return(
            <div>
                <PathBuilderDrawer handleClose={this.handleClose} handleSend={this.handleSend} />
                <Row>   
                    <Col lg={5} md={5} sm={5} xs={5}/>       
                    <Col lg={7} md={7} sm={7} xs={7} >      
                       <Paper style={style.paper} zDepth={0}>
                            <GroupTabs  paths={this.props.paths} changed={this.props.changed} searching={this.props.searching}/>
                        </Paper>        
                    </Col>
                </Row>
            </div>
        )
    }
}

// *** NB: the HOC in validate perms injects {...props} which include router props and the loggedin prop
const mapStateToProps = (store,ownProps) => {
    return {
        paths: store.mainState.paths,
        searching: store.mainState.searching,
        changed: store.mainState.changed,
    }
}

export default connect(mapStateToProps)(PathBuilder);


