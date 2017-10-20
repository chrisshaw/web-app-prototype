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
  selectedOptionsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  selectionChip: {
    margin: '4px 4px 4px 0',
    overflow: 'hidden',
  },
  selectionChipLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  inputStyle: {
    width: null,
    flexGrow: 1,
  },
  inputUnderline: {
    width: '3000px',
    bottom: '3px',
    left: '-1000px',
    right: '-1000px',
  },
  inputUnderlineFocus: {
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
    overflowX: 'hidden'
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
    var uniqueOptions = this.removeDuplicateOptions(props.options);
    this.state = {
      uniqueOptions: uniqueOptions,
      nextCustomId: uniqueOptions.length,
      customSelections: [],
      searchText: '',
      menuItems: uniqueOptions.map(
        function(option) {
          return { "text" : option.name,
                    "value" : (
                      <MenuItem
                      className={'multi-select-auto-complete-field-menu-item'}
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

  removeDuplicateOptions(options) {
    var uniqueSet = new Set();
    return options.filter(function(obj) {
      var id = obj._id;
      var isNewOption = !uniqueSet.has(id);
      if (isNewOption) {
        uniqueSet.add(id);
      }
      return isNewOption;
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options.length != this.props.options.length) {
      this.updateAvailableOptions(nextProps.options);
    } else {
      for (var i = 0; i < nextProps.options.length; i++) {
        if (nextProps.options[i] !== this.props.options[i]) {
          this.updateAvailableOptions(nextProps.options);
          break;
        }
      }
    }
  }

  updateAvailableOptions(newOptions) {
    var uniqueNewOptions = this.removeDuplicateOptions(newOptions);
    var nextCustomId = uniqueNewOptions.length > this.state.nextCustomId ? uniqueNewOptions.length : this.state.nextCustomId;
    this.setState((prevState) => ({
      uniqueOptions: uniqueNewOptions,
      nextCustomId: nextCustomId,
      menuItems: uniqueNewOptions.map(
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

  handleInputChange(newValue, dataSource, params) {
    this.setState({ searchText: newValue });
  }

  handleInputKeyDown(event) {
    const { key } = event;

    if (key === ENTER_KEY || key === TAB_KEY || key === COMMA_KEY) {
      event.preventDefault();

      const searchText = this.state.searchText.trim();
      var indexOfSelection = this.getMenuItemIndex(searchText);
      if (indexOfSelection < 0) {
        this.addChipForSelectedOption(indexOfSelection, false);
      }

      return;
    }

    if (key === BACKSPACE_KEY && this.state.searchText === '') {
      this.handleDeleteSelection(this.props.selectedOptions.length - 1);
    }
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

  addChipForSelectedOption(indexOfSelection, optionSelectedFromList) {
    this.refs.autocomplete.focus();

    const searchText = this.state.searchText.trim();
    if (searchText == '') {
      return;
    }

    var optionAlreadySelected = this.props.selectedOptions.filter(function(obj) { return obj.name == searchText }).length > 0;
    if (optionAlreadySelected && !optionSelectedFromList) {
      return;
    }

    var suggestedOptionSelected = indexOfSelection > -1;
    if (suggestedOptionSelected) {
      helper.updateSelected(this.state.uniqueOptions[indexOfSelection], this.props.queryItem, this.props.dispatch);
      this.setState((prevState) => ({
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
        customSelections: prevState.customSelections.concat(searchText),
        searchText: ''
      }));
    }
    return;
  }

  handleDeleteSelection(indexOfSelection) {
    const { selectedOptions } = this.props;
    this.setState((prevState) => ({
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
    helper.removeChip(this.props.selectedOptions[indexOfSelection]._id, this.props.queryItem, this.props.dispatch);
  }

  handleMenuItemSelected(chosenRequest, index) {
    var indexOfSelection = index;
    if (indexOfSelection < 0) {
      indexOfSelection = this.getMenuItemIndex(chosenRequest)
    }

    var optionSelectedFromList = (index != -1);
    if (indexOfSelection > -1) {
      this.addChipForSelectedOption(indexOfSelection, optionSelectedFromList);
    }
    return;
  }

  render() {
    return (
      <div style={styles.sectionWrapper}>
        <div style={styles.selectedOptionsWrapper}>
          {this.props.selectedOptions.map((selectedOption, index) => (
            <Chip style={styles.selectionChip}
                  labelStyle={styles.selectionChipLabel}
                  onRequestDelete={() => { this.handleDeleteSelection(index); }}
                  key={index}
            >
              {selectedOption.name}
            </Chip>
          ))}
          <AutoComplete
                    dataSource={this.state.menuItems}
                    ref="autocomplete"
                    hintText={this.props.hintText}
                    onUpdateInput={this.handleInputChange}
                    onKeyDown={this.handleInputKeyDown}
                    onNewRequest={this.handleMenuItemSelected}
                    popoverProps={{canAutoPosition: true}}
                    openOnFocus={true}
                    filter={(searchText, key) => (searchText.trim() == '') || (key.indexOf(searchText) !== -1)}
                    style={styles.inputStyle}
                    underlineStyle={styles.inputUnderline}
                    underlineFocusStyle={styles.inputUnderlineFocus}
                    hintStyle={styles.hintTextStyle}
                    searchText={this.state.searchText}
                    menuStyle={styles.dropDownMenu}
                    textFieldStyle={styles.textField}
                    multiLine={false}
                    fullWidth={true}
          />
        </div>
      </div>
    );
  }
}

MultiSelectAutoCompleteField.propTypes = {
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  queryItem: PropTypes.string.isRequired,
};

MultiSelectAutoCompleteField.defaultProps = {
  selectedOptions: [],
  options: [],
  queryItem: '',
  hintText: '',
};

export default connect()(MultiSelectAutoCompleteField);
