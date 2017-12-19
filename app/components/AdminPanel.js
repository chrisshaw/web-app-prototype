import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';

import Snackbar from 'material-ui/Snackbar';
import StudentsTab from './StudentsTab';
import TeachersTab from './TeachersTab';
import ClassTab from './ClassTab';

// *** MUI MIGRATION ***
// import Tabs, { Tab } from 'mui-next/Tabs'
// import Style from './AdminPanel.css'
//
// const navItems = [
//   {
//       value: 'teachersTab',
//       label: "Teachers and Administrators",
//   }
// ]

const styles = {
  wrapper: {
    margin: '0 25px',
  },
  snackbar: {
    textAlign: 'center',
  },
};

class AdminPanel extends PureComponent {
  isPrivilegedUser() {
    const authRole = this.props.authRole && this.props.authRole.toUpperCase();
    return authRole && (authRole === 'TEACHER' || authRole === 'ADMIN' || authRole === 'INTERNAL');
  }

  isAdmin() {
    const authRole = this.props.authRole && this.props.authRole.toUpperCase();
    return authRole && authRole === 'ADMIN';
  }

  render() {
    const { isFlashMessageShowing, flashMessage } = this.props;
    return (
      <div id="admin-table" style={styles.wrapper}>
        <Tabs
            width='100%'
        >
          {this.isAdmin() && <Tab label="Teacher & Administrators">
            <TeachersTab/>
          </Tab>}

          <Tab label="Students">
            <StudentsTab/>
          </Tab>

          {this.isPrivilegedUser() && <Tab label="Class">
            <ClassTab/>
          </Tab>}
        </Tabs>
        <Snackbar open={isFlashMessageShowing}
                  message={flashMessage}
                  style={styles.snackbar}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ authState, flashMessage }) => ({
  authRole: authState.role,
  isFlashMessageShowing: flashMessage.isMessageShowing,
  flashMessage: flashMessage.message,
});

export default connect(mapStateToProps)(AdminPanel);
