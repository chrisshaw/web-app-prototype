import React, {Component} from 'react';
import AppBar from 'mui-next/AppBar';
import Toolbar from 'mui-next/Toolbar';
import Style from './NavBar.css'
import Logo from '../Logo/Logo'
import NavItems from '../NavItems'
import IconButton from 'mui-next/IconButton'
import Icon from 'mui-next/Icon'
import { connect } from 'react-redux';

class NavBar extends Component {
    render(){
        return (
            <AppBar position="static" className={Style.appbar}>
                <Toolbar disableGutters className={`${Style.navbar} ${Style.justifyCenter}`}>
                    <Logo />
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



