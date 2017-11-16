import React from 'react';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';

const styles = {
  container: {
    margin: '20px 15px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  projectSubheader: {
    flex: 3,
    padding: null,
    lineHeight: '30px',
    textAlign: 'left',
  },
  projectLink: {
    flex: 1,
    lineHeight: '30px',
    verticalAlign: 'middle',
  },
  question: {
    paddingTop: '3px',
    borderTop: '1px solid #757575',
    textAlign: 'left',
  },
  topicsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  topicChip: {
    margin: '4px 4px 4px 0',
    overflow: 'hidden',
  },
  topicChipLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

const RelatedProjectItem = ({ project }) => (
  <div style={styles.container}>
    <div style={styles.header}>
      <Subheader style={styles.projectSubheader}>{project.name}</Subheader>
      <a href={project.link}
         target="_blank"
         style={styles.projectLink}
      >
        View Project
      </a>
    </div>
    {project.drivingQuestion &&
      <div style={styles.question}>{project.drivingQuestion}</div>
    }
    <div style={styles.topicsContainer}>
      {project.topics.length > 0
        ? project.topics.map((topic, index) => (
          <Chip style={styles.topicChip}
                labelStyle={styles.topicChipLabel}
                key={index}
          >
            {topic}
          </Chip>
        ))
        : <span>There are no topics in that project</span>
      }
    </div>
  </div>
);

export default RelatedProjectItem;
