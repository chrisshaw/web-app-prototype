import React, {Component} from 'react';
// import ReactDOM from "react-dom";
// import AutoComplete from 'material-ui/AutoComplete';
// import MenuItem from 'material-ui/MenuItem';
import helper from '../helper';
import {connect } from 'react-redux';
// import Chip from 'material-ui/Chip';
// import uuid from 'uuid';
// import ChipInput from 'material-ui-chip-input';
// import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// const names = [
//   'Oliver Hansen',
//   'Van Henry',
//   'April Tucker',
//   'Ralph Hubbard',
//   'Omar Alexander',
//   'Carlos Abbott',
//   'Miriam Wagner',
//   'Bradley Wilkerson',
//   'Virginia Andrews',
//   'Kelly Snyder',
// ];

/**
 * `SelectField` can handle multiple selections. It is enabled with the `multiple` property.
 */
class MultiSelectField extends Component {
//   state = {
//     values: [],
//   };
 constructor(props) {
    super(props)
        // this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
        this.handleChange = this.handleChange.bind(this);
        this.menuItems = this.menuItems.bind(this);
        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.selectionRenderer = this.selectionRenderer.bind(this)
        this.state = { menuStart: 0, menuEnd: 10}
        // this.handleRequestDelete = this.handleRequestDelete.bind(this);
        // this.handleSelect = this.handleSelect.bind(this);
        // this.handleDeleteChip = this.handleDeleteChip.bind(this);
  }

//   handleChange =  => this.setState({values});
    handleMenuChange(e) {
        console.log("test")
        // if there is data in values - get the index and display +-5 around it
    //     if(this.props.list.length > 10) {
    //     // if (this.props.list.indexOf(values[lastElem-1]) > 10) {
    //         if (this.props.list.indexOf(values[lastElem-1]) - 5 > 0){
    //             this.setState({
    //                 menuStart: this.props.list.indexOf(values[lastElem-1]) - 5,
    //                 menuEnd: this.props.list.indexOf(values[lastElem-1]) + 5
    //             })
    //         } else  {
    //             this.setState({
    //                 menuStart: 0,
    //                 menuEnd: this.props.list.indexOf(values[lastElem-1]) + 5
    //             })
    //         }
    //     // }          
    // }
    }
   
    handleChange(event, index, values) {
        let lastElem = values.length;
        // console.log("e, i, v", event.target.index, index, values[lastElem-1])
        // this.setState({searchText: e})
        // this.setState({textFieldValue: e})
        // make sure a full word supplied is in listl
        if (values[lastElem-1] !== []){
            //  helper.updateSelectedGroup(e, false, this.props.dispatch);
             helper.updateSelected(values[lastElem-1], this.props.queryitem, this.props.dispatch);
        }
        // for long lists like the standards list only display a few items


    }

  menuItems(values) {
   console.log(this.state)
   if (this.props.list) {
    let items = [];
    // for (let i = 0; i < 10; i++ ) {
    items.push(this.props.list.slice(this.state.menuStart, this.state.menuEnd).map((name) => (   
        <MenuItem
            key={name._id}
            insetChildren={true}
            checked={values && values.indexOf(name) > -1}
            value={name}
            primaryText={name.name}
           
        />           
    )))
    // }

    return items

   }

  }
selectionRenderer = (values) => {
   console.log(values)
  }

  render() {

    // var dataSource1 = [];
    // var dataSource2 = [];
    // // console.log("this.props.list", this.props.list)
    // if it exists or is not empty array
    // if ((this.props.list) && (this.props.list[0] !== null)){
    //     dataSource1 = this.props.list.map(function(group, index) {
    //         // strip out just the name for the autocomplete field
    //             return group.name             
    //     })
    // }
    // if ((this.props.selectedlist) && (this.props.selectedlist[0] !== null)){
    //     dataSource2 = this.props.selectedlist.map(function(group, index) {
    //         // strip out just the name for the autocomplete field
    //             return group.name
    //     })
    // }

    let values = [];

    if (this.props.selectedlist) {
        values = this.props.selectedlist;
    } 
   
    return (
      <SelectField
        multiple={true}
        hintText="Select a grade"
        value={values}
        onChange={(e, i, v) => this.handleChange(e, i, v)}
        fullWidth={true}
        maxHeight={200}
        selectionRenderer={this.selectionRenderer}
      >
        {this.menuItems(values)}
      </SelectField>
    );
  }
}

export default connect()(MultiSelectField);