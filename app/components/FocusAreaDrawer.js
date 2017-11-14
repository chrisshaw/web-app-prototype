import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FocusAreaDetailsSection from './FocusAreaDetailsSection';
import RelatedProjectsContent from './RelatedProjectsContent';

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

const FocusAreaDrawer = ({ open, focusArea, isFocusAreaFetching, onCloseClick }) => (
  <Drawer open={open}
          openSecondary={true}
          width={'35%'}
  >
    <AppBar title={focusArea && !isFocusAreaFetching ? focusArea.name : ''}
            titleStyle={{textAlign: 'left'}}
            iconElementLeft={<div/>}
            iconElementRight={<IconButton><NavigationClose/></IconButton>}
            onRightIconButtonTouchTap={onCloseClick}
    />
    {isFocusAreaFetching &&
      <div className="loader-location" style={styles.loader}>
        <div className="loader-text">Loading...</div><br />
        <div className="text-center loader" />
      </div>
    }
    {!isFocusAreaFetching && Object.keys(focusArea).length > 0 &&
      <div style={styles.container}>
        <FocusAreaDetailsSection header="Related Standards">
          <RelatedProjectsContent items={focusArea.standards.map(standard => standard._key)} />
        </FocusAreaDetailsSection>
      </div>
    }
  </Drawer>
);

export default FocusAreaDrawer;
