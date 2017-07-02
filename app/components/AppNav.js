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
  },
  titleSmall : {
    height: 50,
    margin: 0,
    lineHeight: 0,
    // flexGrow: 1,
    // flexShrink: 1,
    // flexBasis: 'auto',
    // order: 3,
    // borderBottom: 'solid 1px #e7e7e7',
    // borderLeft: 'solid 1px #808080',
    // borderRight: 'solid 1px #808080',
    // alignSelf: 'flex-end',
  }
};


class AppNav extends Component {
    constructor(props){
        super(props);
    }
    render(){

// if ($(window).width() < 960) {
//    alert('Less than 960');
// }
// else {
//    alert('More than 960');
// }className=""
      var component = this;
       return (<div>
                  <AppBar className={this.props.loggedin ? "large-appbar sticky-navbar sticky-navbar-loggedin" : "sticky-navbar"}
                    title={<div><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
                    titleStyle={styles.title}
                    iconStyleRight={{order: 4, marginTop: 0, marginLeft: 0, display: "flex"}}
                    iconElementLeft={<div className="placeholder"></div>}
                    iconElementRight={<div>{this.props.loggedin ? 
                      (<div>
                      <FlatButton  labelStyle={{lineHeight: 4}} style={{ borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6',maxWidth: 170, fontSize: 12, height: 50, flex: 'center'}}  containerElement={<Link to="/"/>} label="Build Paths" />
                      <FlatButton  labelStyle={{lineHeight: 4}} style={{borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6', maxWidth: 170, fontSize: 12, height: 50, flex: 'center'}} containerElement='label' label="Manage Students"  containerElement={<Link to="/csv"/>} />
                      <IconButton  onTouchTap={this.props.handleLogout} style={{maxWidth: 100, height: 0, alignSelf: 'center'}} ><LogoutIcon /></IconButton>
                      </div>)  : (<div className="placeholder"></div>) } </div>}
                    /> 
                  <AppBar className={this.props.loggedin ? "small-appbar sticky-navbar-loggedin-small" : "hide sticky-navbar"}
                    title={<div><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
                    titleStyle={styles.titleSmall}
                    iconElementRight={<div><IconMenu
                        iconButtonElement={
                         <IconButton style={{maxWidth: 100, height: 0, alignSelf: 'flex-start'}} ><MoreVertIcon /></IconButton>
                        }
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                      >
                        <MenuItem containerElement={<Link to="/"/>} primaryText="Build Paths" />
                        <MenuItem containerElement={<Link to="/csv"/>} primaryText="Manage Students" />
                      </IconMenu>
                     <IconButton  onTouchTap={this.props.handleLogout} style={{maxWidth: 100, height: 0, alignSelf: 'center'}} ><LogoutIcon /></IconButton></div>}
                  />
                </div>


       
        )
    }

};

export default AppNav; 
