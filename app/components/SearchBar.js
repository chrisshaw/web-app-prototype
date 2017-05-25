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

    handleChange(e) {
        // when a grade option is selected this handles the change and what happens next
        // update the state to the selected value
       
        this.setState({ selectValue: e.target.value });
        // handle when grade = 6
        // this is only temporary as we only have grade 6 focus area data
        if (e.target.value === '6'){
            // send to query data from server via api
            helper.sendSearchQuery(e.target.value, this.props.dispatch); 
            // clear old display data
            helper.clearResults("", this.props.dispatch);
        } else if (e.target.value){
            // clear old display data
            // make sure the default value doesnt trigger any action and gives appropriate message
            if (e.target.value !== 'Select a Grade'){
                var endMsg = "for Grade " + e.target.value
            } else {
                var endMsg = " - please select a valid Query";
            }
            var noDataMsg= "No Results " + endMsg;
            // update message property so it is displayed in Results Component - via central redux store
            helper.clearResults(noDataMsg, this.props.dispatch);
        }
    }

    render() {
        return (
            <div >
                <Panel className="query-builder">
                    <Row>
                        <h3 className="text-center">Query Builder</h3>
                    </Row>
                    <Row>
                        <div className="text-center format-query-item"> Please select a grade level:</div>
                        <div className="text-center format-query-item"> 
                            <select value={this.state.selectValue}
                                placeholder="Search by Grade Level e.g. 6"
                                onChange={(e) => this.handleChange(e)}
                                ref={el => this.inputTitle = el}>
                                <option defaultValue="Select">Select a Grade</option>
                                <option value="6">Grade 6</option>
                                <option value="7">Grade 7</option>
                                <option value="8">Grade 8</option>
                            </select>
                        </div>
                    </Row>
                </Panel>
            </div>
  
        );
    }
}


export default connect()(SearchBar);
