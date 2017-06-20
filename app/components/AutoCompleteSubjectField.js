import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import helper from '../helper';
import {connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import uuid from 'uuid';

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

 class AutoCompleteSubjectField extends Component {

  constructor(props) {
    super(props)
    
     this.state = {textFieldValue: "dummy"}; //setting initial default state
     this._handleTextFieldChange = this._handleTextFieldChange.bind(this);

  }
   
    _handleTextFieldChange(e) {
        this.setState({
            textFieldValue: ""
        });
        // make sure a full word supplied is in subjectcontentlist
        if (dataSource1.indexOf(e) !== -1){
             helper.updateSelectedSubject(e, false, this.props.dispatch);
        }

    }
  render() {
    // if it exists or is not empty array
    // console.log("this.props.subjectcontentlist", this.props.subjectcontentlist[0]);
    if ((this.props.subjectcontentlist) && (this.props.subjectcontentlist[0] !== null)){
        dataSource1 = this.props.subjectcontentlist.map(function(group, index) {
            // strip out just the name for the autocomplete field
                return group.name             
        })
    }

     if (this.props.selectedsubjectcontentlist) {
    // || (Object.keys(this.props.selectedsubjectcontentlist).length === 0 && this.props.selectedsubjectcontentlist.constructor === Object)){
    // }  else {
        // console.log("what is this", this.props.selectedsubjectcontentlist)
        var component = this;
        var resultComponents = this.props.selectedsubjectcontentlist.map(function(result) {
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
            <div style={styles.wrapper}>       
          {resultComponents} 
          <AutoComplete
            textFieldStyle={{fontSize: 14}}
            hintText="Type and select from list"
            value={this.state.textFieldValue}
            floatingLabelStyle={{color: '#A35FE3'}}
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={dataSource1}
            underlineShow={true}
            onUpdateInput={(e) => this._handleTextFieldChange(e)}
            underlineDisabledStyle={{ borderColor: '#E6E6E6'}}
            underlineFocusStyle={{borderColor: '#A35FE3'}}
            listStyle={{textColor: '#A35FE3'}}
            />
        </div>
      
        </div>

    )}
}

export default connect()(AutoCompleteSubjectField);