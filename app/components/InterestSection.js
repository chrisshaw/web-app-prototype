import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';

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
  categorySubheader: {
    padding: null,
  },
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
};

class InterestSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      interestInputVal: '',
    };
    this.sectionHeaders = {
      careers: 'Careers',
      causes: 'Social and Environmental Issues',
      localIssues: 'Your School and Community Issues',
      passions: 'Personal Passions',
      humor: 'Things That Make You Laugh',
    };
    this.handleInterestInputChange = this.handleInterestInputChange.bind(this);
    this.handleInterestInputKeyDown = this.handleInterestInputKeyDown.bind(this);
  }

  handleInterestInputChange(event, newValue) {
    this.setState({ interestInputVal: newValue });
  }

  handleInterestInputKeyDown(event) {
    const { key } = event;
    if (key === ENTER_KEY || key === TAB_KEY || key === COMMA_KEY) {
      event.preventDefault();
      if (this.state.interestInputVal.trim() !== '') {
        this.props.onAddInterest(this.props.category, this.state.interestInputVal.trim());
      }
      this.setState({ interestInputVal: '' });
      return;
    }
    if (key === BACKSPACE_KEY && this.state.interestInputVal === '') {
      const { onDeleteInterest, category, interests } = this.props;
      onDeleteInterest(category, interests.length - 1);
    }
  }

  render() {
    const { category, interests, onDeleteInterest } = this.props;
    return (
      <div style={styles.sectionWrapper}>
        <Subheader style={styles.categorySubheader}>{this.sectionHeaders[category]}</Subheader>
        <div style={styles.interestsWrapper}>
          {interests.map((interest, index) => (
            <Chip style={styles.interestChip}
                  labelStyle={styles.interestChipLabel}
                  onRequestDelete={() => { onDeleteInterest(category, index); }}
                  key={index}
            >
              {interest}
            </Chip>
          ))}
          <TextField hintText="Enter new interest"
                     onChange={this.handleInterestInputChange}
                     onKeyDown={this.handleInterestInputKeyDown}
                     value={this.state.interestInputVal}
                     style={styles.interestInput}
                     underlineStyle={styles.interestInputUnderline}
                     underlineFocusStyle={styles.interestInputUnderlineFocus}
                     hintStyle={styles.interestInputHint}
          />
        </div>
      </div>
    );
  }
}

InterestSection.propTypes = {
  category: PropTypes.string.isRequired,
  interests: PropTypes.array.isRequired,
  onAddInterest: PropTypes.func.isRequired,
};

InterestSection.defaultProps = {
  category: '',
  interests: [],
};

export default InterestSection;
