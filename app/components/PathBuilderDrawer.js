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
                height: '100vh'
            }
        }
        return (
                <div>              
                    <Drawer
                        containerClassName="drawer-small-screen"
                        docked={true}
                        width={500}
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

