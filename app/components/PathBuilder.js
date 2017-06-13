import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import QueryBuilderDrawer from './QueryBuilderDrawer.js';

class PathBuilder extends Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <div>
                <Grid>  
                    <Col xs={12} md={4}>
                        <QueryBuilderDrawer />
                    </Col>
                    <Col xs={12} md={8} >
                       nothing
                    </Col>
                </Grid>
            </div>
        )
    }
}

export default PathBuilder;

