import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {connect } from 'react-redux';
import PathPaper from './PathPaper';

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

    }
}

class PathBuilder extends Component{
   constructor(props) {
        super(props);
        // this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    // componentWillMount(){
    //      helper.toggleDrawer(true, this.props.dispatch);
    // }
    // handleToggle() {
    //     helper.toggleDrawer(!this.props.toggledrawer, this.props.dispatch);
    //     helper.pathsRendered(false, this.props.dispatch);      
    // }
    handleClose(){
        helper.toggleDrawer(false, this.props.dispatch);
    }
    render(){

        return(
            <div>
                <PathBuilderDrawer handleClose={this.handleClose} />
                <Row>   
                    <Col md={5} />       
                    <Col md={7} >      
                    <PathPaper />             
                    </Col>
                </Row>
            </div>
        )
    }
}

// export default PathBuilder;

// const mapStateToProps = (store) => {
//     return {
//         toggledrawer: store.mainState.toggledrawer,
//     }
// }

export default PathBuilder;

