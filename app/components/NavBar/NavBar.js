import React, {Component} from 'react';
import AppBar from 'mui-next/AppBar';
import Toolbar from 'mui-next/Toolbar';
import Style from './NavBar.css'
import Logo from '../Logo/Logo'
import NavItems from '../NavItems'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Tabs, {Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import Button from 'mui-next/Button'; // next
import Typography from 'mui-next/Typography'
import ExitToApp from 'material-ui-icons/ExitToApp'; 
import { connect } from 'react-redux';


const styles = {
  title : {
    height: 0,
    margin: 0,
    lineHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    order: 3,
  },
  icons: {
      margin: 'auto'
  }
};

class NavBar extends Component {
    render(){
        console.log(this.props.permissions, this.props.loggedIn)
        return (
            <AppBar position="static" className={Style.navbar}>
                <Toolbar>
                    <Logo />
                    <NavItems
                        className={Style.navButtons}
                        permissions={this.props.permissions}
                        handleLogout={this.handleLogout}
                    />
                </Toolbar>
            </AppBar>
        )
    }
};

const mapStateToProps = store => ({
    loggedIn: store.authState.loggedIn,
    permissions: store.authState.permissions
})

export default connect()(NavBar); 



