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
  studentName: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  masteredInfo: {
    flex: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    textAlign: 'right',
  },
};

function getDaysAgo(lastUpdated) {
  const now = +new Date();
  const diffSec = (now - lastUpdated) / 1000;
  return Math.floor(diffSec / 86400);
}

const PotentialTeacherContent = ({ items }) => (
  <div style={styles.container}>
    {items.length > 0
      ? items.map((item) => (
        <div style={styles.itemContainer}
             key={item._id}
        >
          <span style={styles.studentName}>{item.name}</span>
          <span style={styles.masteredInfo}>Mastered {getDaysAgo(item.lastUpdated)} Days Ago</span>
        </div>
      ))
      : <span>There are no potential peer teachers</span>
    }
  </div>
);

export default PotentialTeacherContent;
