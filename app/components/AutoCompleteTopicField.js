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
var dataSource2 = [];
 class AutoCompleteTopicField extends Component {

  constructor(props) {
    super(props)
    
    this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
    // this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);

  }
    handleSelect(){
        this.setState({searchText: ''})
    }
    _handleTextFieldChange(e) {
         this.setState({searchText: e})
        this.setState({
            textFieldValue: ""
        });
        // make sure a full word supplied is in topiclist
        if (dataSource1.indexOf(e) !== -1){
             helper.updateSelectedTopic(e, false, this.props.dispatch);
        }

    }
       handleDeleteChip(chip, index){
        // console.log(chip, index)
        for (var i=0; i<this.props.selectedtopiclist.length; i++){
            // console.log(this.props.selectedtopiclist[i].name)
            if(this.props.selectedtopiclist[i].name === chip){
                this.props.handleRequestDelete(this.props.selectedtopiclist[i].id);
                return;
            }
        }
    // find the group.id and pass to delete
}
  render() {
    // if it exists or is not empty array
    // console.log("this.props.topiclist", this.props.topiclist[0]);
    if ((this.props.topiclist) && (this.props.topiclist[0] !== null)){
        dataSource1 = this.props.topiclist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name             
        })
    }

    if ((this.props.selectedtopiclist) && (this.props.selectedtopiclist[0] !== null)){
        dataSource2 = this.props.selectedtopiclist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name
        })
    }


     if (this.props.selectedtopiclist) {
    // || (Object.keys(this.props.selectedtopiclist).length === 0 && this.props.selectedtopiclist.constructor === Object)){
    // }  else {
        // console.log("what is this", this.props.selectedtopiclist)
        var component = this;
        var resultComponents = this.props.selectedtopiclist.map(function(result) {
          return <Chip
              key={result.id}
              onRequestDelete={() => component.props.handleRequestDelete(result.id)}
              style={styles.chip}
              >
              {result.name}
            </Chip>

          })
      }

    
    // return (
    //   <div style={styles.wrapper}>       
    //      
    //   </div>
    // );
   
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

export default connect()(AutoCompleteTopicField);