import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Tabs, {Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
import ExpandMoreIcon from './ExpandMoreIcon';
import HomeIcon from './HomeIcon';
import UploadIcon from './UploadIcon';

const styles = {
//   smallIcon: {
//     width: 36,
//     height: 36,
//   },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
//   small: {
//     width: 72,
//     height: 72,
//     padding: 16,
//   },
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

const MyAppNav = () => (
        <div >
            <AppBar className="sticky-navbar"
            title={<div className="text-center"><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
            showMenuIconButton={true}
            iconElementLeft={<IconButton  iconStyle={styles.mediumIcon} style={styles.medium} className="left-nav" containerElement={<Link to="/"/>} label="Home"><HomeIcon/></IconButton>}
            iconElementRight={<IconButton iconStyle={styles.mediumIcon} style={styles.medium} className="right-nav" containerElement={<Link to="/csv"/>} label="Upload Data"><UploadIcon/></IconButton>}
            />    
        </div>

);
 
export default MyAppNav;