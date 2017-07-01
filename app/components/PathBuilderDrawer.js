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
                        docked={true}
                        width={530}
                        style={style.drawer}               
                    >        
                        <Row>
                            <QueryBuilder />
                        </Row>                  
                    </Drawer>
                </div>
                )
    }
   }

export default PathBuilderDrawer;

