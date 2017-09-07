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
import Chip from 'material-ui/Chip';


var styles = {
    chip: {
    margin: 7,
    },
    wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    },
    auto: {
        fontSize: 14,
    }
};



class MultiSelectField extends Component {

    constructor(props) {
        super(props)
            this.handleChange = this.handleChange.bind(this);
            this.menuItems = this.menuItems.bind(this);
            this.handleMenuChange = this.handleMenuChange.bind(this);
            this.handleRequestDelete = this.handleRequestDelete.bind(this);
            this.state = { menuStart: 0, menuEnd: 10}  // show 10 menu items initially for long lists
    }

    // function called when list items are scrolled or navigated using  keys
    handleMenuChange(name) {
        // get the position in the list - then if > than max list or < min list do something
        let currentMenuPosition = this.props.list.indexOf(name);
        // needed to handle long lists like the one for standards
        if (currentMenuPosition  === this.state.menuEnd - 1){
            this.setState({
                menuStart: this.state.menuStart + 1,
                menuEnd: this.state.menuEnd + 1
            })
        } else if ((currentMenuPosition  === this.state.menuStart) && (currentMenuPosition > 0)){
            this.setState({
                menuStart: this.state.menuStart-1,
                menuEnd: this.state.menuEnd-1,
            })
        }
    }
    // function called when list items are selected
    handleChange(e, i, values) {
        let lastElem = values.length;
                 console.log("values", values[lastElem-1]._id)
        //  console.log("values._id", values._id)
        // make sure a full word supplied is in list
        if (values[lastElem-1] !== []){
            // verify if to be added or removed   
           console.log("this.props.selectedlist", this.props.selectedlist)
            if (this.props.selectedlist && this.props.selectedlist.length > 0 && this.props.selectedlist.indexOf(values[lastElem-1]) !== -1){
                 console.log("this.props.selectedlist.indexOf(values)", this.props.selectedlist.indexOf(values[lastElem-1]))
                // remove it       
                helper.removeChip(values[lastElem-1]._id, this.props.queryitem, this.props.dispatch);
            } else {
                helper.updateSelected(values[lastElem-1], this.props.queryitem, this.props.dispatch);
            }
            // either way recenter list if necessary
            let currentMenuPosition = this.props.list.indexOf(values[lastElem-1]);
            // needed to handle long lists like the one for standards
            if ((currentMenuPosition > 5) && (this.props.list.length > 10)){
                this.setState({
                    menuStart: currentMenuPosition - 4,
                    menuEnd: currentMenuPosition + 5
                })
            }
        }
    }

  menuItems(values) {
   if (this.props.list) {
    let items = [];
    items.push(this.props.list.slice(this.state.menuStart, this.state.menuEnd).map((name) => (   
        <MenuItem
            insetChildren={true}
            checked={values && values.indexOf(name) > -1}
            value={name}
            primaryText={name.name}
            onMouseOver={() => this.handleMenuChange(name)}
            onKeyDown={() => this.handleMenuChange(name)}
            onKeyUp={() => this.handleMenuChange(name)}
        />           
    )))
    return items
   }

  }
    handleRequestDelete(id) {
        // filter list based on id
        helper.removeChip(id, this.props.queryitem, this.props.dispatch);
    }

  render() {
    let values = [];
    if (this.props.selectedlist) {
        values = this.props.selectedlist;
    } 
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
        <div className="chip-style">
        {resultComponents}
        </div>
      <SelectField
        multiple={true}
        hintText={this.props.hintText}
        onChange={this.handleChange}
        fullWidth={true}
        maxHeight={200}
        disableAutoFocus={true}
      >
        {this.menuItems(values)}
      </SelectField>
      </div>
    );
  }
}

export default connect()(MultiSelectField);