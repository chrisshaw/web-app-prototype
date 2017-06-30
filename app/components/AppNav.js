import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Tabs, {Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Link} from 'react-router';
import ExpandMoreIcon from './ExpandMoreIcon';
import HomeIcon from './HomeIcon';
import UploadIcon from './UploadIcon';
import LogoutIcon from './LogoutIcon'; 

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
  },
  title : {
    height: 50,
    margin: 0,
    lineHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    order: 3,
    // borderBottom: 'solid 1px #e7e7e7',
    // borderLeft: 'solid 1px #808080',
    // borderRight: 'solid 1px #808080',
    // alignSelf: 'flex-start',
  }
};


class AppNav extends Component {
    constructor(props){
        super(props);
    }
    render(){

      var component = this;
       return (<div >
            <AppBar className={this.props.loggedin ? "sticky-navbar sticky-navbar-loggedin" : "sticky-navbar"}
            title={<div><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
            titleStyle={styles.title}
            iconStyleLeft={{border: 2, marginTop: 0, display: "flex", flex: 0, justifyContent: 'center', alignSelf: 'center', alignItems: 'center'}}
            iconStyleRight={{order: 4, marginTop: 0, marginLeft: 0, display: "flex"}}
            iconElementLeft={ <div>{this.props.loggedin ? 
              (<div><IconButton onTouchTap={this.props.handleLogout} style={{minWidth: 100, height: 50, flex: 'center', alignSelf: 'center'}}><LogoutIcon /></IconButton></div>)  : (<div className="placeholder"></div>) } </div>}
            iconElementRight={<div>{this.props.loggedin ? 
              (<div><FlatButton labelStyle={{lineHeight: 4}} style={{borderTop: 'solid 1px #e7e7e7',borderLeft: 'solid 1px #e7e7e7',borderRight: 'solid 1px #e7e7e7', minWidth: 130, height: 50, flex: 'center'}}  containerElement={<Link to="/"/>} label="Home" />
              <FlatButton labelStyle={{lineHeight: 4}} style={{ borderTop: 'solid 1px #e7e7e7',borderLeft: 'solid 1px #e7e7e7', borderRight: 'solid 1px #e7e7e7',minWidth: 130, height: 50, flex: 'center'}}  containerElement={<Link to="/pathbuilder"/>} label="Build Paths" />
              <FlatButton labelStyle={{lineHeight: 4}}  style={{borderTop: 'solid 1px #e7e7e7',borderLeft: 'solid 1px #e7e7e7', borderRight: 'solid 1px #e7e7e7',minWidth: 130, height: 50, flex: 'center'}} containerElement='label' label="Manage Students"  containerElement={<Link to="/csv"/>} /></div>)  : (<div className="placeholder"></div>) } </div>}
            />    
        </div>
       
        )
    }

};
 
export default AppNav;

// <div>{this.props.loggedin ? 
//               (<IconMenu
//     iconButtonElement={
//       <IconButton><MoreVertIcon /></IconButton>
//     }
//     targetOrigin={{horizontal: 'right', vertical: 'top'}}
//     anchorOrigin={{horizontal: 'right', vertical: 'top'}}
//   >
//     <MenuItem primaryText="Home" containerElement={<Link to="/"/>} />
//     <MenuItem primaryText="Upload" containerElement={<Link to="/csv"/>}  />
//     <MenuItem primaryText="Path Builder" onTouchTap={this.props.showPathBuilder}/>
//     <MenuItem primaryText="Sign Out" onTouchTap={this.props.handleLogout}/>
//   </IconMenu>) 
//                 : "" } </div>