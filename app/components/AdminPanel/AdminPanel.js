import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// *** MUI MIGRATION ***
import StudentTable from '../StudentTable/StudentTable'
import EditDrawer from '../EditDrawer/EditDrawer'
import Style from './AdminPanel.css'

class AdminPanel extends PureComponent {
    render() {
        return (
            <main className={Style.main}>
              <StudentTable />
              <EditDrawer />
            </main>
        );
    }
}

const mapStateToProps = ({ authState }) => ({
    authRole: authState.role
});

export default connect(
    mapStateToProps
)(AdminPanel);
