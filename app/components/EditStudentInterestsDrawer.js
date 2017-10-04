import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { Tabs, Tab } from 'material-ui/Tabs';
import InterestsTab from './InterestsTab';

const EditStudentInterestsDrawer = ({ open, student, onCloseClick, onAddInterest, onDeleteInterest, onSaveInterests }) => (
  <Drawer open={open}
          openSecondary={true}
          width={'35%'}
  >
    <AppBar title={student.first + ' ' + student.last}
            iconElementLeft={<div/>}
            iconElementRight={<IconButton><NavigationClose/></IconButton>}
            onRightIconButtonTouchTap={onCloseClick}
    />
    <Tabs>
      <Tab label="Interests">
        <InterestsTab interests={student.interests}
                      onAddInterest={onAddInterest}
                      onDeleteInterest={onDeleteInterest}
                      onSaveInterests={onSaveInterests}
        />
      </Tab>
    </Tabs>
  </Drawer>
);

EditStudentInterestsDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  student: PropTypes.object.isRequired,
  onCloseClick: PropTypes.func.isRequired,
};

EditStudentInterestsDrawer.defaultProps = {
  open: false,
  student: {},
};

export default EditStudentInterestsDrawer;
