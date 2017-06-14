import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import helper from '../helper';
import {connect } from 'react-redux';

// const colors = [
//   'Red',
//   'Orange',
//   'Yellow',
//   'Green',
//   'Blue',
//   'Purple',
//   'Black',
//   'White',
// ];
 


const dataSource1 = [
 'Group 1',
  'Group 2',
   'Group 3',
];
/**
 * The first example has `MenuItem`s in its data source that display on data entry.
 * The second example uses an array of values as its `dataSource`, and updates on focus.
 * Both examples have filtering disabled.
 */
 class AutoCompleteField extends Component {

  constructor(props) {
    super(props)
     console.log("in render", this.props.grouplist);
     this.state = {textFieldValue: "dummy"}; //setting initial default state
     this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    }
   
    _handleTextFieldChange(e) {
        this.setState({
            textFieldValue: e
        });
        // make sure a full word supplied
        if (e.length > 5){
             console.log('in here......', e);
             helper.updateSelectedGroup(e, false, this.props.dispatch);
        }
    
       
    }
  render() {

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
//  <TextField value={this.state.textFieldValue} onChange={this._handleTextFieldChange} />

    )}
}

export default connect()(AutoCompleteField);