import React, { Component } from 'react';
import {connect } from 'react-redux';
import {searchQuery} from '../actions';

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
        console.log(e.target.value)
        this.setState({ value: e.target.value });
        // if enter pressed send it to server for processing
        if (e.keyCode == 13) {
            console.log(queryString, " query submitted");
        }
    }


    render() {
        return (
            <input
                type="text"
                value={this.state.value}
                placeholder="Search Values"
                onChange={(e) => this.handleChange(e, this.state.value)}
                onKeyUp={(e) => this.handleChange(e, this.state.value)}
            />
  
        );
    }
}


export default SearchBar;
