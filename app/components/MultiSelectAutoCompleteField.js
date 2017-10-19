import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import {connect} from 'react-redux';

import helper from '../helper';

const ENTER_KEY = 'Enter';
const TAB_KEY = 'Tab';
const BACKSPACE_KEY = 'Backspace';
const COMMA_KEY = ',';

const styles = {
  interestsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  // categorySubheader: {
  //   padding: null,
  // },
  interestChip: {
    margin: '4px 4px 4px 0',
    overflow: 'hidden',
  },
  interestChipLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  interestInput: {
    width: null,
    flexGrow: 1,
  },
  interestInputHint: {
    bottom: '10px',
  },
  interestInputUnderline: {
    width: '3000px',
    bottom: '3px',
    left: '-1000px',
    right: '-1000px',
  },
  interestInputUnderlineFocus: {
    borderTop: 'rgb(244, 244, 244)',
    borderBottom: 'rgb(244, 244, 244)',
    borderLeft: 'rgb(244, 244, 244)',
    borderRight: 'rgb(244, 244, 244)',
  },
  sectionWrapper: {
    marginBottom: '20px',
  },
  dropDownMenu: {
    maxHeight: '250px',
    overflowY: 'auto',
  },
  dropDownList: {
  },
  textField: {
    overflowX: 'hidden',
  },
  hintTextStyle: {
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
  }
};

class MultiSelectAutoCompleteField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nextCustomId: props.options.length,
      customSelections: [],
      searchText: '',
      menuItems: props.options.map(
        function(option) {
          return { "text" : option.name,
                    "value" : (
                      <MenuItem
                      primaryText={option.name}
                      insetChildren={true} />
                    )};
        }),
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    this.handleMenuItemSelected = this.handleMenuItemSelected.bind(this);
    this.handleDeleteSelection = this.handleDeleteSelection.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Prevent an unneeded render
    if (nextProps.startTime !== this.state.startTime) {
      this.setState((prevState) => ({
        nextCustomId: props.options.length,
        menuItems: props.options.map(
          function(option) {
            return { "text" : option.name,
                      "value" : (
                        <MenuItem
                        primaryText={option.name}
                        insetChildren={true} />
                      )};
          }),
      }));
    }
  }

  handleInputChange(newValue, dataSource, params) {
    this.setState({ searchText: newValue });
    console.log("input change: " + newValue);
  }

  getMenuItemIndex(option) {
    if (option !== '') {
      for (var index = 0; index < this.state.menuItems.length; index++) {
        if (this.state.menuItems[index].text == option) {
          return index;
        }
      }
    }
    return -1; //not found
  }

  addChipForSelectedOption(indexOfSelection) {
    const searchText = this.state.searchText.trim();
    if (searchText == '') {
      return;
    }

    var optionAlreadySelected = this.props.selectedOptions.filter(function(obj) { return obj.name == searchText}).length > 0;// this.state.selectedOptions.filter(function(obj) { return obj.option == searchText }).length > 0;//
    if (optionAlreadySelected) {
      return;
    }

    // this.props.onAddInterest(this.props.category, searchText);
    // helper.updateSelected(searchText, this.props.queryItem, this.props.dispatch);
    // this.props.onAddSelection(searchText);

    var suggestedOptionSelected = indexOfSelection > -1;
    if (suggestedOptionSelected) {
      helper.updateSelected(this.props.options[indexOfSelection], this.props.queryItem, this.props.dispatch);
      this.setState((prevState) => ({
        // selectedOptions: prevState.selectedOptions.concat({ "option" : searchText, "custom" : false }),
        menuItems: prevState.menuItems.map(function(menuItem, index) {
          if (index == indexOfSelection) {
            return { "text" : menuItem.text,
                      "value" : (
                        <MenuItem
                          primaryText={menuItem.text}
                          checked={true}
                          disabled={true} />)};
          }
          return menuItem;
        }),
        searchText: ''
      }));
    } else {
      helper.updateSelected({ _id: this.state.nextCustomId, name: searchText}, this.props.queryItem, this.props.dispatch);
      this.setState((prevState) => ({
        nextCustomId: prevState.nextCustomId + 1,
        // selectedOptions: prevState.selectedOptions.concat(searchText),//{ "option" : searchText, "custom" : true }),
        customSelections: prevState.customSelections.concat(searchText),
        searchText: ''
      }));
    }
    console.log(this.state);
    return;
  }

  handleInputKeyDown(event) {
    const { key } = event;

    if (key === ENTER_KEY || key === TAB_KEY || key === COMMA_KEY) {
      event.preventDefault();

      const searchText = this.state.searchText.trim();
      var indexOfSelection = this.getMenuItemIndex(searchText);
      if (indexOfSelection < 0) {
        this.addChipForSelectedOption(indexOfSelection);
      }

      return;
    }

    if (key === BACKSPACE_KEY && this.state.searchText === '') {
      // const { category } = this.props;
      this.handleDeleteSelection(/*category,*/ this.props.selectedOptions.length - 1);
    }
  }

  handleDeleteSelection(indexOfSelection) {
    const { selectedOptions } = this.props;
    this.setState((prevState) => ({
      // selectedOptions: prevState.selectedOptions.filter(function(selection) { if (selection != prevState.selectedOptions[indexOfSelection]) { return selection; } }),
      customSelections: prevState.customSelections.filter(function(selection) { if (selection != selectedOptions[indexOfSelection]) { return selection; } }),
      menuItems: prevState.menuItems.map(function(menuItem, index) {
        if (menuItem.text == selectedOptions[indexOfSelection].name) {
          return { "text" : menuItem.text,
                    "value" : (
                      <MenuItem
                        primaryText={menuItem.text}
                        insetChildren={true} />)};
        }
        return menuItem;
      }),
    }));
    helper.removeChip(/*id*/this.props.selectedOptions[indexOfSelection]._id, this.props.queryItem, this.props.dispatch);
    // onRemoveSelection(indexOfSelection);
    // onDeleteInterest(category, indexOfSelection);
    console.log(this.state);
  }

  handleMenuItemSelected(chosenRequest, index) {
    var indexOfSelection = index;
    if (indexOfSelection < 0) {
      indexOfSelection = this.getMenuItemIndex(chosenRequest)
    }
    if (indexOfSelection > -1) {
      this.addChipForSelectedOption(indexOfSelection);
    }
    return;
  }

  render() {
    // const { selectedOptions } = this.props;
    return (
      <div style={styles.sectionWrapper}>
        <div style={styles.interestsWrapper}>
          {this.props.selectedOptions.map((selectedOption, index) => (
            <Chip style={styles.interestChip}
                  labelStyle={styles.interestChipLabel}
                  onRequestDelete={() => { this.handleDeleteSelection(/*category,*/ index); }}
                  key={index}
            >
              {selectedOption.name}
            </Chip>
          ))}
          <AutoComplete
                    dataSource={this.state.menuItems}
                    // dataSourceConfig={{text : 'option', value : 'value'}}
           hintText={this.props.hintText}
                     onUpdateInput={this.handleInputChange}
                     onKeyDown={this.handleInputKeyDown}
                     onNewRequest={this.handleMenuItemSelected}
                     openOnFocus={true}
                    filter={(searchText, key) => (searchText.trim() == '') || (key.indexOf(searchText) !== -1)}
                     style={styles.interestInput}
                     underlineStyle={styles.interestInputUnderline}
                     underlineFocusStyle={styles.interestInputUnderlineFocus}
                     hintStyle={styles.hintTextStyle}
                     searchText={this.state.searchText}
                     listStyle={styles.dropDownList}
                     menuStyle={styles.dropDownMenu}
                     textFieldStyle={styles.textField}
                     multiLine={false}
                     fullWidth={true}
                     anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
          />
        </div>
      </div>
    );
  }
}

MultiSelectAutoCompleteField.propTypes = {
  // category: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  queryItem: PropTypes.string.isRequired,
  // onAddSelection: PropTypes.func.isRequired,
  // onRemoveSelection: PropTypes.func.isRequired,
};

MultiSelectAutoCompleteField.defaultProps = {
  // category: '',
  selectedOptions: [],
  options: [],
  queryItem: '',
  hintText: '',
};

export default connect()(MultiSelectAutoCompleteField);
