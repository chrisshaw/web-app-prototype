import React, { Component } from 'react';
import {connect } from 'react-redux';
import SearchBar from './SearchBar';
import Results from './Results';
import {Grid, Row, Col} from 'react-bootstrap';
// import {newTodo, deleteTodo} from '../actions';


class Main extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }
   
    render(){
        console.log("in main");
        return(
            <Grid>   
                <Row>
                    <SearchBar />    
                </Row>
                <Row>
                    <Results />       
                </Row>
            </Grid>
        )
    }
}

export default Main;
