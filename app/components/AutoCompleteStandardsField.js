import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import helper from '../helper';
import {connect } from 'react-redux';

var dataSource1 = [];

 class AutoCompleteStandardsField extends Component {

  constructor(props) {
    super(props)
    
     this.state = {textFieldValue: "dummy"}; //setting initial default state
     this._handleTextFieldChange = this._handleTextFieldChange.bind(this);

  }
   
    _handleTextFieldChange(e) {
        this.setState({
            textFieldValue: e
        });
        // make sure a full word supplied is in grouplist
        if (dataSource1.indexOf(e) !== -1){
             helper.updateSelectedStandards(e, false, this.props.dispatch);
        }

    }
  render() {
    // if it exists or is not empty array
    // console.log("this.props.standardslist", this.props.standardslist);
    if ((this.props.standardslist) && (this.props.standardslist[0] !== null)){
        dataSource1 = this.props.standardslist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name             
        })
    }
   
    return (
        <div>
            <AutoComplete
            value={this.state.textFieldValue}
            floatingLabelText="Type 'r', case insensitive"
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={dataSource1}
            onUpdateInput={(e) => this._handleTextFieldChange(e)}
            />
        </div>

    )}
}

export default connect()(AutoCompleteStandardsField);