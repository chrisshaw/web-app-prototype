import React, { Component } from 'react';
import {connect } from 'react-redux';
// import {newTodo, deleteTodo} from '../actions';


class Results extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }
   
    render(){
        console.log("in results");
        return(
             <div>The Results</div>
        )
    }
}

export default Results;
