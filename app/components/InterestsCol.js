import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

const INTERESTS_MIN_HEIGHT = 40;

const styles = {
  wrapper: {
    height: INTERESTS_MIN_HEIGHT + 'px',
    width: 'calc(100% - 100px)',
    display: 'inline-flex',
    flexWrap: 'wrap',
  },
  wrapperShowAll: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: '4px',
    overflow: 'hidden',
  },
  chipLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ellipsisIcon: {
    verticalAlign: 'bottom',
  },
  moreBtnWrapper: {
    display: 'inline-block',
  },
};

class StudentInterests extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAllInterestsShowing: true,
      wasShowBtnPressed: false,
    };

    this.handleClickMoreBtn = this.handleClickMoreBtn.bind(this);
    this.getJoinedInterests = this.getJoinedInterests.bind(this);
  }

  handleClickMoreBtn(event) {
    event.stopPropagation();
    this.setState({
      isAllInterestsShowing: true,
      wasShowBtnPressed: true,
    });
  }

  getJoinedInterests() {
    const interestsObj = this.props.interests;
    let joinedInterests = [];
    for (let interestsKey in interestsObj) {
      for (let interest of interestsObj[interestsKey]) {
        joinedInterests.push(interest);
      }
    }
    return joinedInterests;
  }

  componentDidMount() {
    if (this.interestsWrapper.clientHeight > INTERESTS_MIN_HEIGHT && !this.state.wasShowBtnPressed) {
      this.setState({ isAllInterestsShowing: false });
    }
  }

  render() {
    return (
      <div>
        <div style={this.state.isAllInterestsShowing ? styles.wrapperShowAll : styles.wrapper}
             ref={(interestsWrapper) => { this.interestsWrapper = interestsWrapper; }}
        >
          {this.getJoinedInterests().map((interest, index) => {
            return <Chip style={styles.chip}
                         labelStyle={styles.chipLabel}
                         key={index}
            >
              {interest}
            </Chip>
          })}
        </div>
        {!this.state.isAllInterestsShowing &&
          <div style={styles.moreBtnWrapper}>
            <FontIcon className="material-icons" style={styles.ellipsisIcon}>more_horiz</FontIcon>
            <FlatButton label="Show more"
                        onClick={this.handleClickMoreBtn}
            />
          </div>
        }
      </div>
    );
  }
}

StudentInterests.propTypes = {
  interests: PropTypes.object.isRequired,
};

StudentInterests.defaultProps = {
  interests: {},
};

export default StudentInterests;
