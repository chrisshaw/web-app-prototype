import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RelatedProjectItem from './RelatedProjectItem';

const styles = {
  container: {
    margin: '20px 15px',
  },
  loader: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: '-45px',
  },
};

const RelatedProjectsDrawer = ({ open, relatedProjects, isRelatedProjectsFetching, onCloseClick }) => (
  <Drawer open={open}
          openSecondary={true}
          width={'35%'}
  >
    <AppBar title={'Related Projects'}
            titleStyle={{textAlign: 'left'}}
            iconElementLeft={<div/>}
            iconElementRight={<IconButton><NavigationClose/></IconButton>}
            onRightIconButtonTouchTap={onCloseClick}
    />
    {isRelatedProjectsFetching &&
      <div className="loader-location" style={styles.loader}>
        <div className="loader-text">Loading...</div><br />
        <div className="text-center loader" />
      </div>
    }
    {!isRelatedProjectsFetching && Object.keys(relatedProjects).length > 0 &&
    <div style={styles.container}>
      {relatedProjects.map((project) => (
        <RelatedProjectItem project={project}
                            key={project._id}
        />
      ))}
    </div>
    }
  </Drawer>
);

export default RelatedProjectsDrawer;
