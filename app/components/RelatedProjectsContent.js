import React from 'react';
import Chip from 'material-ui/Chip';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  projectChip: {
    margin: '4px 4px 4px 0',
    overflow: 'hidden',
  },
  projectChipLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

const RelatedProjectsContent = ({ items }) => (
  <div style={styles.container}>
    {items.length > 0
      ? items.map((item, index) => (
        <Chip style={styles.projectChip}
              labelStyle={styles.projectChipLabel}
              key={index}
        >
          {item}
        </Chip>
      ))
      : <span>There are no related standards</span>
    }
  </div>
);

export default RelatedProjectsContent;
