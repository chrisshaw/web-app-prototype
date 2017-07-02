import React, {Component} from 'react';
// import ReactDOM from "react-dom";
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



 class AutoCompleteStandrdsField extends Component {

  constructor(props) {
    super(props)
        this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
        this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
  }
    handleRequestDelete(id) {
        // filter standardslist based on id
        helper.removeGroup(id, this.props.dispatch);
    }
    handleSelect(){
        this.setState({searchText: ''})
    }
   
    _handleTextFieldChange(e, dataSource1) {
        this.setState({searchText: e})
        this.setState({textFieldValue: e})
        // make sure a full word supplied is in standardslist
        if (dataSource1.indexOf(e) !== -1){
             helper.updateSelectedStandards(e, false, this.props.dispatch);
        }

    }
    handleDeleteChip(chip, index){
       for (var i=0; i<this.props.selectedstandardslist.length; i++){
           if(this.props.selectedstandardslist[i].name === chip){
             this.props.handleRequestDelete(this.props.selectedstandardslist[i]._id);
             return;
           }
       }
    }
  render() {
    var dataSource1 = [];
    var dataSource2 = [];
    // if it exists or is not empty array
    if ((this.props.standardslist) && (this.props.standardslist[0] !== null)){
        dataSource1 = this.props.standardslist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name             
        })
    }
    if ((this.props.selectedstandardslist) && (this.props.selectedstandardslist[0] !== null)){
        dataSource2 = this.props.selectedstandardslist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name
        })
    }

     if (this.props.selectedstandardslist) {
        var component = this;
        var resultComponents = this.props.selectedstandardslist.map(function(result) {
          return <Chip
              key={result._id}
              onRequestDelete={() => component.handleRequestDelete(result._id)}
              style={styles.chip}
              >
              {result.name}
            </Chip>

          })
      }
   
    return (
        <div>

        <ChipInput
            fullWidth={true}
            value={dataSource2}
            style={{fontSize: 13}}
            onRequestAdd={(chip) => this._handleTextFieldChange(chip, dataSource1)}
            onRequestDelete={(chip, index) => this.handleDeleteChip(chip, index)}
            textFieldStyle={{fontSize: 13}}
            textareaStyle={{fontSize: 13}}
            hintText="Type and select from list"
            searchText={this.state.searchText}
            floatingLabelStyle={{color: '#A35FE3'}}
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={dataSource1}
            underlineShow={true}
            onNewRequest={this.handleSelect}
            underlineDisabledStyle={{ borderColor: '#E6E6E6'}}
            underlineFocusStyle={{borderColor: '#A35FE3'}}
            listStyle={{textColor: '#A35FE3', fontSize: 12}}
/>


      
        </div>

    )}
}

export default connect()(AutoCompleteStandrdsField);