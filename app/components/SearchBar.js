import React, { Component } from 'react';
import {connect } from 'react-redux';
import {searchQuery} from '../actions';
import helper from '../helper'
// var axios = require("axios");
// import {focusAreaResults} from '../actions';

class SearchBar extends Component{
    constructor(props){
        super(props);
        this.state = {value: ""}; //setting initial default state

    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    }

    handleChange(e, queryString) {
        // console.log(e.target.value)
        this.setState({ value: e.target.value });
        // if enter pressed send it to server for processing
        if (e.keyCode == 13) {
            // do something with the value -- send for processing
            console.log(queryString, " query submitted");
            // var component = this;
            // return axios.get('/focusarea/6').then(function(response) {
            //     console.log("what is heare", response.data);
            //     //    this.props.dispatch(deleteTodo(this.props.id));
            //     component.props.dispatch(focusAreaResults(response.data))
            //     return ;
            // })
            helper.sendSearchQuery(this.state.value, this.props.dispatch);
            // reset state after use
            this.setState({value: ""});
        }

    }


    render() {
        return (
            <div className="margin-top">
                <div>Please enter the grade level:</div>
                <input
                    type="text"
                    value={this.state.value}
                    placeholder="Search by Grade Level e.g. 6"
                    onChange={(e) => this.handleChange(e, this.state.value)}
                    onKeyUp={(e) => this.handleChange(e, this.state.value)}
                    ref={el => this.inputTitle = el}
                />
                <div>Hit Enter to Search</div>
            </div>
  
        );
    }
}


export default connect()(SearchBar);
