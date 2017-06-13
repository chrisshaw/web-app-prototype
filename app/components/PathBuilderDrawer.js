import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {Grid, Row, Col} from 'react-bootstrap';
import QueryBuilder from './QueryBuilder';


// const style = {
//   height: '80vh',
//   width: '80vw',
//   margin: 20,
//   textAlign: 'center',
//   display: 'flex',
//   flex: 1,
//   alignItems: 'center',
//   justifyContent: 'center',
//   button: {
//     marginTop: 12,
//     marginBottom: 12,
//     display: 'block',
//     backgroundColor: "#2FBB2F"
//   },
//   paper: {
//       color: '#000000'
//   }
// };

class PathBuilderDrawer extends Component{

   constructor(props) {
        super(props);
        console.log(this.props);
        // this.handleToggle = this.handleToggle.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        // console.log(this.props.toggledrawer, "intial state")
    }
    // componentWillMount(){
    //      helper.toggleDrawer(false, this.props.dispatch);
    //      console.log(this.props.toggledrawer, "mount state")
    // }
    // handleToggle() {
    //     //    console.log(this.props.toggledrawer, "ssss;e");
    //     console.log(this.props.toggledrawer, "handle state")
    //     helper.toggleDrawer(!this.props.toggledrawer, this.props.dispatch)
    // }
    // handleClose(){
    //     helper.toggleDrawer(false, this.props.dispatch);
    // }
    render() {
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
                backgroundColor: "#2FBB2F"
            },


        }
        return (
                <div>
                    
  
                 
                    <Drawer
                        docked={false}
                        width={650}
                        open={this.props.toggledrawer}
                        onRequestChange={this.props.handleToggle}
                        style={style.drawer}
                    
                    >
                    <div  className="drawer-wrapper">  
                        <Row className="text-center">
                            <Col md={2} />
                            <Col xs={12} md={8}>
                                <RaisedButton secondary={true} containerElement='label' style={style.button} label="Hide Path Builder" onTouchTap={this.props.handleClose} />
                            </Col>
                            <Col md={2} />
                        </Row>
                        <Row>
                            <QueryBuilder />
                        </Row>


                    </div>
                    
                    </Drawer>
                </div>
                )
    }
   }

// const mapStateToProps = (store,ownProps) => {
//     return {
//         toggledrawer: store.mainState.toggledrawer,
//     }
// }

export default PathBuilderDrawer;

