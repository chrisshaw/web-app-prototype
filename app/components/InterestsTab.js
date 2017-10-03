import React from 'react';
import PropTypes from 'prop-types';
import InterestSection from './InterestSection';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  tabWrapper: {
    margin: '0 15px 20px',
    overflow: 'hidden',
  },
  saveBtnWrapper: {
    textAlign: 'center',
  },
};

const InterestTab = ({ interests, onAddInterest, onDeleteInterest, onSaveInterests }) => (
  <div style={styles.tabWrapper}>
    {Object.keys(interests).map((interestKey) => (
      <InterestSection category={interestKey}
                       interests={interests[interestKey]}
                       key={interestKey}
                       onAddInterest={onAddInterest}
                       onDeleteInterest={onDeleteInterest}
      />
    ))}
    <div style={styles.saveBtnWrapper}>
      <RaisedButton label="Save Interests"
                    onClick={onSaveInterests}
      />
    </div>
  </div>
);

InterestTab.propTypes = {
  interests: PropTypes.object.isRequired,
};

InterestTab.defaultProps = {
  interests: {},
};

export default InterestTab;
