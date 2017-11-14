import React from 'react';

const styles = {
  container: {
    width: '100%',
    textAlign: 'left',
  },
  itemContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  focusAreaName: {
    flex: 2,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  courseName: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'right',
  },
};

const RelatedFocusAreasContent = ({ items }) => (
  <div style={styles.container}>
    {items.length > 0
      ? items.map((item) => (
        <div style={styles.itemContainer}
             key={item._id}
        >
          <span style={styles.focusAreaName}>{item.name}</span>
          <span style={styles.courseName}>{item.course}</span>
        </div>
      ))
      : <span>There are no related focus areas</span>
    }
  </div>
);

export default RelatedFocusAreasContent;
