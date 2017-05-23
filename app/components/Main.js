import React, { Component } from 'react';
import {connect } from 'react-redux';
import Nav from './Navbar';
import QueryBuilder from './QueryBuilder';


import {Grid, Row, Col} from 'react-bootstrap';
// import {newTodo, deleteTodo} from '../actions';


class Main extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
         console.log("initial state", this.props.noResultsMsg);

    }
   
    render(){

        return(
            <div>
              <Nav /> 
              {this.props.children}
            </div>
        )
    }
}


export default Main;

