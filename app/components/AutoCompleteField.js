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

var dataSource1 = [];
var dataSource2 = [];

 class AutoCompleteField extends Component {

  constructor(props) {
    super(props)
    
    this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    // this.handleAddChip = this.handleAddChip.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);

  }
    handleRequestDelete(id) {
        // console.log("id of group for delete", id);
        // filter grouplist based on id
        // console.log(this)
        helper.removeGroup(id, this.props.dispatch);
    }
    handleSelect(){
        this.setState({searchText: ''})
    }
   
    _handleTextFieldChange(e) {
        this.setState({searchText: e})
         this.setState({textFieldValue: e})

        // make sure a full word supplied is in grouplist
        if (dataSource1.indexOf(e) !== -1){
             helper.updateSelectedGroup(e, false, this.props.dispatch);
        }

    }
    handleDeleteChip(chip, index){
        console.log(chip, index)
       for (var i=0; i<this.props.selectedgrouplist.length; i++){
           console.log(this.props.selectedgrouplist[i].name)
           if(this.props.selectedgrouplist[i].name === chip){
             this.props.handleRequestDelete(this.props.selectedgrouplist[i].id);
             return;
           }
       }
       // find the group.id and pass to delete
     

    }

  render() {
    // if it exists or is not empty array
    // console.log("this.props.grouplist", this.props.grouplist[0]);
    if ((this.props.grouplist) && (this.props.grouplist[0] !== null)){
        dataSource1 = this.props.grouplist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name             
        })
    }
    if ((this.props.selectedgrouplist) && (this.props.selectedgrouplist[0] !== null)){
        dataSource2 = this.props.selectedgrouplist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name
        })
    }

     if (this.props.selectedgrouplist) {
    // || (Object.keys(this.props.selectedgrouplist).length === 0 && this.props.selectedgrouplist.constructor === Object)){
    // }  else {
        // console.log("what is this", this.props.selectedgrouplist)
        var component = this;
        var resultComponents = this.props.selectedgrouplist.map(function(result) {
          return <Chip
              key={result.id}
              onRequestDelete={() => component.handleRequestDelete(result.id)}
              style={styles.chip}
              >
              {result.name}
            </Chip>

          })
      }

// this npm package works great - except for delete - need to rework to pass group.id instead of index or do some calculation to convert match name with group.id
//            <ChipInput
//             fullWidth={true}
//             value={dataSource2}
//             onRequestAdd={(chip) => this._handleTextFieldChange(chip)}
//             onRequestDelete={this.props.handleRequestDelete}
//             textFieldStyle={{fontSize: 14}}
//             hintText="Type and select from list"
//             searchText={this.state.searchText}
//             floatingLabelStyle={{color: '#A35FE3'}}
//             filter={AutoComplete.caseInsensitiveFilter}
//             dataSource={dataSource1}
//             underlineShow={true}
//             onNewRequest={this.handleSelect}
//             underlineDisabledStyle={{ borderColor: '#E6E6E6'}}
//             underlineFocusStyle={{borderColor: '#A35FE3'}}
//             listStyle={{textColor: '#A35FE3'}}
// />
   
    return (
        <div>

        <ChipInput
            fullWidth={true}
            value={dataSource2}
            onRequestAdd={(chip) => this._handleTextFieldChange(chip)}
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

export default connect()(AutoCompleteField);