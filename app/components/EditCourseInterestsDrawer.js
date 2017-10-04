import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Tabs, Tab } from 'material-ui/Tabs';
import InterestsTab from './InterestsTab';

const EditCourseInterestsDrawer = ({ open, course, onCloseClick, onAddInterest, onDeleteInterest, onSaveInterests }) => (
  <Drawer open={open}
          openSecondary={true}
          width={'35%'}
  >
    <AppBar title={course.name}
            iconElementLeft={<div/>}
            iconElementRight={<IconButton><NavigationClose/></IconButton>}
            onRightIconButtonTouchTap={onCloseClick}
    />
    <Tabs>
      <Tab label="Shared interests">
        <InterestsTab interests={course.interests}
                      onAddInterest={onAddInterest}
                      onDeleteInterest={onDeleteInterest}
                      onSaveInterests={onSaveInterests}
        />
      </Tab>
    </Tabs>
  </Drawer>
);

EditCourseInterestsDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  course: PropTypes.object.isRequired,
  onCloseClick: PropTypes.func.isRequired,
};

EditCourseInterestsDrawer.defaultProps = {
  open: false,
  course: {},
};

export default EditCourseInterestsDrawer;
