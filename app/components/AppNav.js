import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Tabs, {Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router';
import ExpandMoreIcon from './ExpandMoreIcon';
import HomeIcon from './HomeIcon';
import UploadIcon from './UploadIcon';

const styles = {
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  }
};

class AppNav extends Component {
    constructor(props){
        super(props);
    }
    render(){

    
       return (<div >
            <AppBar className="sticky-navbar"
            title={<div className="text-center"><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
            showMenuIconButton={true}
            iconElementLeft={<div><IconButton iconStyle={styles.mediumIcon} style={styles.medium} className="right-nav" containerElement={<Link to="/csv"/>} label="Upload Data"><UploadIcon/></IconButton><IconButton  iconStyle={styles.mediumIcon} style={styles.medium} className="left-nav" containerElement={<Link to="/"/>} label="Home"><HomeIcon/></IconButton></div>}
            iconElementRight={<div> {this.props.loggedin ? (
            <RaisedButton  secondary={true} containerElement='label' onTouchTap={this.props.handleLogout} label="Logout" />
          ) : "" }</div>}
            />    
        </div>)
    }

};
 
export default AppNav;