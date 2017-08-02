import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Tabs, {Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
import LogoutIcon from './LogoutIcon'; 
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {connect } from 'react-redux';


const styles = {
  title : {
    height: 50,
    margin: 0,
    lineHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    order: 3,
  }
};


var component = this;
const Small = (props) => (
  <IconMenu className="menu-on-small-screen"
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
     { (props.perms.indexOf("buildpath") !== -1) ?  (<MenuItem  containerElement={<Link to="/buildpath"/>} primaryText="Build Paths" />) : ''}
    { (props.perms.indexOf("uploadstudents") !== -1) ?  (<MenuItem  primaryText="Upload Students" containerElement='label'  containerElement={<Link to="/uploadstudents"/>} />) : ''}
    { (props.perms.indexOf("manageusers") !== -1) ?  (<MenuItem  primaryText="Manage Users"  containerElement={<Link to="/manageusers"/>} />) : ''}
    <MenuItem   primaryText="Logout" onTouchTap={props.handleLogout} />
  </IconMenu>
);

const Normal = (props) => (<div className="menu-on-normal-screen">
                     { (props.perms.indexOf("buildpath") !== -1) ?  (<FlatButton  labelStyle={{lineHeight: 4}} style={{ borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6',maxWidth: 170, fontSize: 12, height: 50, flex: 'center', borderRadius: 0}} containerElement={<Link to="/buildpath"/>} label="Build Paths" />) : ''} 
                     { (props.perms.indexOf("uploadstudents") !== -1) ?  (<FlatButton  labelStyle={{lineHeight: 4}} style={{borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6', maxWidth: 170, fontSize: 12, height: 50, flex: 'center', borderRadius: 0}} containerElement='label' label="Upload Students"  containerElement={<Link to="/uploadstudents"/>} />) : ''} 
                     { (props.perms.indexOf("manageusers") !== -1) ?  (<FlatButton  labelStyle={{lineHeight: 4}} style={{borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6', maxWidth: 170, fontSize: 12, height: 50, flex: 'center', borderRadius: 0}} containerElement='label' label="Manage Users"  containerElement={<Link to="/manageusers"/>} />) : ''} 
                      <IconButton  onTouchTap={props.handleLogout}  iconStyle={{height: 48}} style={{maxWidth: 100, alignSelf: 'center'}} ><LogoutIcon /></IconButton>
                      </div>);

class AppNav extends Component {
    constructor(props){
        super(props);
    }
    render(){
      // console.log("perms", this.props.perms)
       return (<div>
                  <AppBar className={this.props.loggedin ? "sticky-navbar sticky-navbar-loggedin" : "sticky-navbar"}
                    title={(((this.props.pathname === '/buildpath') ||(this.props.pathname === '/')) && (this.props.loggedin)) ? "" : (<div><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>)}
                    titleStyle={styles.title}
                    iconStyleRight={{order: 4, marginTop: 0, marginLeft: 0, display: "flex"}}
                    iconStyleLeft={{display: 'none'}}
                    iconElementRight={<div>{this.props.loggedin && this.props.perms ? 
                      (<div><Small {...this.props} /><Normal {...this.props}/></div>)  : (<div className="placeholder"></div>) } </div>}
                    />     
           
                </div>)
    }
};
export default connect()(AppNav); 



