import React, { Component } from 'react';
import {connect } from 'react-redux';
import {searchQuery} from '../actions';
import helper from '../helper'
import {Row, Col, Panel} from 'react-bootstrap';
// var axios = require("axios");
// import {focusAreaResults} from '../actions';

class SearchBar extends Component{
    constructor(props){
        super(props);
        this.state = {selectValue: ""}; //setting initial default state

    }

    // getValidationState() {
    //     const length = this.state.value.length;
    //     if (length > 10) return 'success';
    //     else if (length > 5) return 'warning';
    //     else if (length > 0) return 'error';
    // }

    handleChange(e) {
        // when a grade option is selected this handles the change
        this.setState({ selectValue: e.target.value });
            // this is only temporary as we only have grade 6 focus area data
            if (e.target.value === '6'){
                 console.log(e.target.value, " query submitted");
                helper.sendSearchQuery(e.target.selectValue, this.props.dispatch);
                // reset state after use
                this.setState({selectValue: ""});
                helper.clearResults("", this.props.dispatch);
            } else {
                 // clear old display results data
                var noDataMsg= "No Results for Grade " + e.target.value;
                helper.clearResults(noDataMsg, this.props.dispatch);
            }
    }


    render() {

        return (
            <div className="margin-top">
              
                    <div>Please select a grade level:</div>
                    <select value={this.state.selectValue}
                        placeholder="Search by Grade Level e.g. 6"
                        onChange={(e) => this.handleChange(e)}
                        ref={el => this.inputTitle = el}>
                        <option selected>Grade</option>
                        <option value="6">Grade 6</option>
                        <option value="7">Grade 7</option>
                        <option value="8">Grade 8</option>
                    </select>
                
                    
          
            </div>
  
        );
    }
}


export default connect()(SearchBar);
