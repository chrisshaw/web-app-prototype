import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {connect } from 'react-redux';
import PathPaper from './PathPaper';

const style = {
    drawer: {
        color: '#808080',
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
        // display: 'block',
        backgroundColor: "#2FBB2F",
        mariginLeft: '10px'

    }
}

class PathBuilder extends Component{
   constructor(props) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // console.log(this.props.toggledrawer, "intial state")
    }
    componentWillMount(){
         helper.toggleDrawer(false, this.props.dispatch);
        //  console.log(this.props.toggledrawer, "mount state")
    }
    handleToggle() {
        //    console.log(this.props.toggledrawer, "ssss;e");
        // console.log(this.props.toggledrawer, "handle state")
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
                    
                     <PathPaper selectedgrouplist={this.props.selectedgrouplist} />
                    
                    </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

// export default PathBuilder;

const mapStateToProps = (store,ownProps) => {
    return {
        toggledrawer: store.mainState.toggledrawer,
        grouplist: store.mainState.grouplist,
        selectedgrouplist: store.mainState.selectedgrouplist,
    }
}

export default connect(mapStateToProps)(PathBuilder);

