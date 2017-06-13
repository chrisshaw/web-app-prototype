import React, { Component } from 'react';
import SearchBar from './SearchBar';
import Results from './Results';
import {Grid, Row, Col} from 'react-bootstrap';

class QueryBuilder extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
    }

    render(){
        return(
            <div>
                <Grid>  
                    <Col xs={12} md={4}>
                        <SearchBar />    
                    </Col>
                    <Col xs={12} md={8} >
                        <Results focusarea={this.props.focusarea} noResultsMsg={this.props.noResultsMsg} />          
                    </Col>
                </Grid>
            </div>
        )
    }
}


export default QueryBuilder;

