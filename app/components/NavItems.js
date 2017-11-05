import React, { Component } from 'react'
import Tabs, {Tab} from 'mui-next/Tabs'
import IconButton from 'mui-next/IconButton'
import ExitToApp from 'material-ui-icons/ExitToApp'
import { Link } from 'react-router';


class NavItems extends Component {
    state = {
        value: "buildPath"
    }

    handleChange = (event, value) => {
        this.setState( { value } )

    }

    render() {
        const props = this.props
        return (
            <Tabs
                value={this.state.value}
                onChange={this.handleChange}
            >
                { props.permissions && props.permissions.includes("buildPath") ? (
                    <Tab
                        label="Build Paths"
                        value="buildPath"
                        component={Link}
                        to="/build-path"
                    />
                 ) : null} 
                { props.permissions && props.permissions.includes("manageStudents") ? (
                    <Tab
                        label="Set Up"
                        value="setup"
                        component={Link}
                        to="/setup"
                    />
                 ) : null} 
                { props.permissions && props.permissions.includes("createAccounts") ? (
                    <Tab
                        label="Create Account"
                        value="createAccount"
                        component={Link}
                        to="create-account"
                    />
                 ) : ''} 
                { <IconButton
                    aria-label="Log out"
                    onTouchTap={props.handleLogout}
                >
                    <ExitToApp />
                </IconButton> }
            </Tabs>
        )
    }
}

export default NavItems