import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const FocusAreaDrawer = ({ open, focusArea, onCloseClick }) => (
  <Drawer open={open}
          openSecondary={true}
          width={'35%'}
  >
    <AppBar title={focusArea.name}
            titleStyle={{ textAlign: 'left' }}
            iconElementLeft={<div/>}
            iconElementRight={<IconButton><NavigationClose/></IconButton>}
            onRightIconButtonTouchTap={onCloseClick}
    />
  </Drawer>
);

export default FocusAreaDrawer;
