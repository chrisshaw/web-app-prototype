import React from 'react';
import Chip from 'material-ui/Chip';

const styles = {
  interestChip: {
    margin: '4px 4px 4px 0',
    overflow: 'hidden',
  },
  interestChipLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

const RelatedProjectsContent = ({ items }) => (
  <div>
    {items.length > 0
      ? items.map((item, index) => (
        <Chip style={styles.interestChip}
              labelStyle={styles.interestChipLabel}
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
