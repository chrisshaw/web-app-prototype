import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import helper from '../helper';
import {connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import uuid from 'uuid';
import ChipInput from 'material-ui-chip-input';

var styles = {
    chip: {
    margin: 7,
    },
    wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    },
    auto: {
        fontSize: 14
    }
};

var dataSource1 = [];

class AutoCompleteCSVFAField extends Component {

    constructor(props) {
    super(props)
        this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
        this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    }
    _handleTextFieldChange(e) {
        this.setState({searchText: e})
        this.setState({textFieldValue: e})
        // make sure a full word supplied is in grouplist
        helper.saveSelectedFA(e,this.props.dispatch);
        helper.updateCSV(e, 0, "focusArea", this.props.dispatch); 

    }
    render() {
    // if it exists or is not empty array
    if ((this.props.focusArea) && (this.props.focusArea[0] !== null)){
        dataSource1 = this.props.focusArea.map(function(group, index) {
            // strip out just the name for the autocomplete field
            return group.name             
        })
    }

    return (
        <div>
            <AutoComplete
            textFieldStyle={{fontSize: 14}}
            hintText="Type and select from list"
            searchText={this.state.searchText}
            value={this.state.textFieldValue}
            floatingLabelStyle={{color: '#A35FE3'}}
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={dataSource1}
            underlineShow={true}
            fullWidth={true}
            onUpdateInput={(e) => this._handleTextFieldChange(e)}
            underlineDisabledStyle={{ borderColor: '#E6E6E6'}}
            underlineFocusStyle={{borderColor: '#A35FE3'}}
            listStyle={{textColor: '#A35FE3'}}
            />
        </div>
        
        

    )}
}

export default connect()(AutoCompleteCSVFAField);