import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {Grid, Row, Col} from 'react-bootstrap';
import QueryBuilder from './QueryBuilder';
import PathAppNav from './PathAppNav';

class PathBuilderDrawer extends Component{
   constructor(props) {
        super(props);
    }
    render() {
        return (      
            <Drawer
                width={'30%'}
                docked={true}       
            >     
                <PathAppNav />   
                <Row>
                    <QueryBuilder handleSend={this.props.handleSend}/>
                </Row>                  
            </Drawer>
        )
    }
   }



export default PathBuilderDrawer;

