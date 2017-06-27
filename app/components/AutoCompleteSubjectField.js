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



 class AutoCompleteTopicField extends Component {

  constructor(props) {
    super(props)
        this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
        this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
  }
    handleRequestDelete(id) {
        // filter subjectcontentlist based on id
        helper.removeGroup(id, this.props.dispatch);
    }
    handleSelect(){
        this.setState({searchText: ''})
    }
   
    _handleTextFieldChange(e, dataSource1) {
        this.setState({searchText: e})
        this.setState({textFieldValue: e})
        // make sure a full word supplied is in subjectcontentlist
        if (dataSource1.indexOf(e) !== -1){
             helper.updateSelectedSubject(e, false, this.props.dispatch);
        }

    }
    handleDeleteChip(chip, index){
       for (var i=0; i<this.props.selectedsubjectcontentlist.length; i++){
           if(this.props.selectedsubjectcontentlist[i].name === chip){
             this.props.handleRequestDelete(this.props.selectedsubjectcontentlist[i]._id);
             return;
           }
       }
    }
  render() {
    var dataSource1 = [];
    var dataSource2 = [];
    // if it exists or is not empty array
    if ((this.props.subjectcontentlist) && (this.props.subjectcontentlist[0] !== null)){
        dataSource1 = this.props.subjectcontentlist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name             
        })
    }
    if ((this.props.selectedsubjectcontentlist) && (this.props.selectedsubjectcontentlist[0] !== null)){
        dataSource2 = this.props.selectedsubjectcontentlist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name
        })
    }

     if (this.props.selectedsubjectcontentlist) {
        var component = this;
        var resultComponents = this.props.selectedsubjectcontentlist.map(function(result) {
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
            onRequestAdd={(chip) => this._handleTextFieldChange(chip, dataSource1)}
            onRequestDelete={(chip, index) => this.handleDeleteChip(chip, index)}
            textFieldStyle={{fontSize: 14}}
            hintText="Type and select from list"
            searchText={this.state.searchText}
            floatingLabelStyle={{color: '#A35FE3'}}
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={dataSource1}
            underlineShow={true}
            onNewRequest={this.handleSelect}
            underlineDisabledStyle={{ borderColor: '#E6E6E6'}}
            underlineFocusStyle={{borderColor: '#A35FE3'}}
            listStyle={{textColor: '#A35FE3'}}
/>

      
        </div>

    )}
}

export default connect()(AutoCompleteTopicField);