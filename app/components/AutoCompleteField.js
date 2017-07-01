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



 class AutoCompleteField extends Component {

  constructor(props) {
    super(props)
        this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
        this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
        this.handleRequestDelete = this.handleRequestDelete.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDeleteChip = this.handleDeleteChip.bind(this);
  }
    handleRequestDelete(id) {
        // filter list based on id
        helper.removeGroup(id, this.props.dispatch);
    }
    handleSelect(){
        this.setState({searchText: ''})
    }
   
    _handleTextFieldChange(e, dataSource1) {
        this.setState({searchText: e})
        this.setState({textFieldValue: e})
        // make sure a full word supplied is in list
        if (dataSource1.indexOf(e) !== -1){
            //  helper.updateSelectedGroup(e, false, this.props.dispatch);
             helper.updateSelected(e, false, this.props.queryitem, this.props.dispatch);
        }

    }
    handleDeleteChip(chip, index){
       for (var i=0; i<this.props.selectedlist.length; i++){
           if(this.props.selectedlist[i].name === chip){
             this.props.handleRequestDelete(this.props.selectedlist[i]._id);
             return;
           }
       }
    }
  render() {
    var dataSource1 = [];
    var dataSource2 = [];
    // if it exists or is not empty array
    if ((this.props.list) && (this.props.list[0] !== null)){
        dataSource1 = this.props.list.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name             
        })
    }
    if ((this.props.selectedlist) && (this.props.selectedlist[0] !== null)){
        dataSource2 = this.props.selectedlist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name
        })
    }
console.log(dataSource2)
    if (this.props.selectedlist) {
    var component = this;
    var resultComponents = this.props.selectedlist.map(function(result) {
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

export default connect()(AutoCompleteField);