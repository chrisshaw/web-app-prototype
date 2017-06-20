import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Tabs, {Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';


const muiTheme = getMuiTheme({
    palette: {
    textColor: '#808080',
    // this one is for the tabs bar and appBar 
    primary1Color: "#FFFFFF",
    // primary2Color: "#40C83C",
    // primary3Color: '#A35FE3',
    // this one overrides the underline in tabs
    accent1Color: "#40C83C",
    accent2Color: '#A35FE3',
    accent3Color: '#808080',
    alternateTextColor: '#808080',
    disabledColor: '#E6E6E6',
    
  },
  chip: {
      backgroundColor: '#A35FE3',
      textColor: '#FFFFFF',
  },
});

const MyAppNav = () => (
        <div >
            <AppBar className="sticky-navbar"
            title={<div className="text-center"><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
            showMenuIconButton={false}
            />
            <MuiThemeProvider muiTheme={muiTheme}><Tabs inkBarStyle={{background: '#A35FE3'}} className="sticky-navbar-tabs">
                <Tab  label="Home" containerElement={<Link to="/"/>}/>
                <Tab  label="Path Builder" containerElement={<Link to="/"/>}/>
                <Tab  label="Import Data" containerElement={<Link to="/csv"/>}/>
            </Tabs></MuiThemeProvider>
        </div>

);
 
export default MyAppNav;