import React, { PureComponent } from 'react';
import Subheader from 'material-ui/Subheader';

const styles = {
  interestsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  categorySubheader: {
    padding: null,
    textAlign: 'left',
  },
  interestChip: {
    margin: '4px 4px 4px 0',
    overflow: 'hidden',
  },
  interestChipLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sectionWrapper: {
    marginBottom: '20px',
  },
};

class FocusAreaDetailsSection extends PureComponent {
  render() {
    const { header, children } = this.props;
    return (
      <div style={styles.sectionWrapper}>
        <Subheader style={styles.categorySubheader}>{header}</Subheader>
        <div style={styles.interestsWrapper}>
          {children}
        </div>
      </div>
    );
  }
}

export default FocusAreaDetailsSection;
