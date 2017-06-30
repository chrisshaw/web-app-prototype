import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {Grid, Row, Col} from 'react-bootstrap';
import QueryBuilder from './QueryBuilder';

class PathBuilderDrawer extends Component{

   constructor(props) {
        super(props);
    }
    render() {
        const style = {
            drawer: {
                zIndex: 2000,
                position: 'fixed',
                top: '300px'
            },
            span: {  
            },
            button: {
                marginTop: 12,
                marginBottom: 12,
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
                            <QueryBuilder />
                        </Row>                  
                    </Drawer>
                </div>
                )
    }
   }

export default PathBuilderDrawer;

