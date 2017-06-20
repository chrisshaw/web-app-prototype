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

    }

    render() {
        const style = {
            drawer: {
                // color: '#808080',
                zIndex: 2000,
                position: 'fixed',
                top: '300px'
            },
            span: {
                // color: '#FFFFFF',
            
            },
            button: {
                marginTop: 12,
                marginBottom: 12,
                // backgroundColor: "#2FBB2F"
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
                  
                        <Row className="text-center">
                            <Col md={2} />
                            <Col xs={12} md={8}>
                                <RaisedButton secondary={true} containerElement='label' style={style.button} label="Hide Path Builder" onTouchTap={this.props.handleClose} />
                            </Col>
                            <Col md={2} />
                        </Row>
                        <Row>
                            <QueryBuilder closeDrawer={this.props.handleClose} />
                        </Row>


             
                    
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

