import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Tabs, {Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Link} from 'react-router';
import ExpandMoreIcon from './ExpandMoreIcon';
import HomeIcon from './HomeIcon';
import UploadIcon from './UploadIcon';
import LogoutIcon from './LogoutIcon'; 
import {Grid, Row, Col,NavItem,Navbar, Nav, NavDropdown, MenuItem} from 'react-bootstrap';

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
  title: {
    minWidth: 350,
    overflow: 'none',
    display: 'flex'
  },
  iconRight:{
    marginTop: 50,
    marginLeft: 100,
    marginRight: 100,
    // float: 'left',
    display: 'flex',
    // minWidth: 300,
    // overflow: 'wrap',
  },
  // img : {
  //   maxWidth: 350,
  // }
  // appbar: {
  //   minWidth: '550',
  // }
};

const menuTabs = (<div classNameName="nav-items"><span><FlatButton  label="Build Paths" containerElement={<Link to="/"/>} /></span><span ><FlatButton  label="Manage Students" containerElement={<Link to="/csv"/>} /></span></div>)

class AppNav extends Component {
    constructor(props){
        super(props);
    }
    render(){
      
      return (<div>  <Navbar collapseOnSelect>
      <Nav>
        <NavItem eventKey={1} href="#">Link</NavItem>
      </Nav>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#"><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} href="#">Link</NavItem>
        <NavItem eventKey={2} href="#">Link</NavItem>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">Link Right</NavItem>
        <NavItem eventKey={2} href="#">Link Right</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar></div>)
    }

};
 
export default AppNav;


// <div >
//             <AppBar classNameName="sticky-navbar"
//             title={<div classNameName="text-center"><span><img src="./public/assets/img/sidekick.png" classNameName="logo" alt="Sidekick" /></span></div>}
//             showMenuIconButton={true}
//             iconElementLeft={<div>{this.props.loggedin ? 
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
//                 : "" } </div>}
//             />    
//         </div>