import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Style from './NavBar.css'
import Logo from '../Logo/Logo'
import NavItems from '../NavItems'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import { connect } from 'react-redux';

class NavBar extends Component {
    render(){
        return (
            <AppBar position="static" color='default'>
                <Toolbar disableGutters className={`${Style.navbar} ${Style.justifyCenter}`}>
                    <Logo upper />
                </Toolbar>
                <Toolbar className={`${Style.navbar} ${Style.justifySpread}`}>
                    <NavItems
                        permissions={this.props.permissions}
                        handleLogout={this.handleLogout}
                    />
                    <IconButton
                        aria-label="Log out"
                        onClick={this.props.handleLogout}
                    >
                        <Icon>
                            exit_to_app
                        </Icon>
                    </IconButton>
                </Toolbar>
            </AppBar>
        )
    }
};

const mapStateToProps = store => ({
    loggedIn: store.authState.loggedIn,
    permissions: store.authState.permissions
})

export default connect(mapStateToProps)(NavBar); 



