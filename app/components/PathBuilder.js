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
        }
}

class PathBuilder extends Component{
   constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }
    handleClose(){
        helper.toggleDrawer(false, this.props.dispatch);
    }
    render(){
        return(
            <div>
                <PathBuilderDrawer handleClose={this.handleClose} />
                <Row>   
                    <Col md={5} xs={7}/>       
                    <Col md={7} xs={5} >      
                       <Paper style={style.paper} zDepth={0}>
                            <GroupTabs />
                        </Paper>        
                    </Col>
                </Row>
            </div>
        )
    }
}

export default PathBuilder;

