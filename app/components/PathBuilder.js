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
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    componentWillMount(){
        // console.log("begin called")
         helper.toggleDrawer(true, this.props.dispatch);
    }
    handleToggle() {
        helper.toggleDrawer(!this.props.toggledrawer, this.props.dispatch)
    }
    handleClose(){
        helper.toggleDrawer(false, this.props.dispatch);
    }
    render(){

        return(
            <div>
                <PathBuilderDrawer handleToggle={this.handleToggle} handleClose={this.handleClose} toggledrawer={this.props.toggledrawer}/>
                <Grid>                   
                    <Row>       
                    <Col md={12} >
                        <RaisedButton
                            label="Show Path Builder"
                            onTouchTap={this.handleToggle}
                            style={style.button} 
                            containerElement='label' 
                            secondary={true}
                            />         
                     <PathPaper />             
                    </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

// export default PathBuilder;

const mapStateToProps = (store) => {
    return {
        toggledrawer: store.mainState.toggledrawer,
    }
}

export default connect(mapStateToProps)(PathBuilder);

