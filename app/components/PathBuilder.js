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
    handleSend() {
        // used by the "send to Sidekick" button in QueryBuilder
        helper.sendToSidekick(this.props.paths)   
    }
    render(){
        return(
            <div>
                <PathBuilderDrawer handleClose={this.handleClose} handleSend={this.handleSend} />
                <Row>   
                    <Col lg={5} md={5} sm={5} xs={5}/>       
                    <Col lg={7} md={7} sm={7} xs={7} >      
                       <Paper style={style.paper} zDepth={0}>
                        {this.props.searching ? (<div>
        
                            <div className="loader-location">
                            <div className="loader-text">Searching...</div>
                            <br />
                            <div className="text-center loader"></div></div>
                            </div>) : (<GroupTabs selectedfa={this.props.selectedfa} fa={this.props.fa} username={this.props.username}  paths={this.props.paths} changed={this.props.changed} />)}

                                                
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
        fa: store.mainState.fa,
        selectedfa: store.mainState.selectedfa,
    }
}

export default connect(mapStateToProps)(PathBuilder);


