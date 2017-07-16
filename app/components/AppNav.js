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


class AppNav extends Component {
    constructor(props){
        super(props);
    }
    render(){
       return (<div>
                  <AppBar className={this.props.loggedin ? "sticky-navbar sticky-navbar-loggedin" : "sticky-navbar"}
                    title={((this.props.pathname === '/buildpath')&&(this.props.loggedin)) ? "" : (<div><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>)}
                    titleStyle={styles.title}
                    iconStyleRight={{order: 4, marginTop: 0, marginLeft: 0, display: "flex"}}
                    iconStyleLeft={{display: 'none'}}
                    iconElementRight={<div>{this.props.loggedin ? 
                      (<div>
                      <FlatButton  labelStyle={{lineHeight: 4}} style={{ borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6',maxWidth: 170, fontSize: 12, height: 50, flex: 'center', borderRadius: 0}} containerElement={<Link to="/buildpath"/>} label="Build Paths" />
                      <FlatButton  labelStyle={{lineHeight: 4}} style={{borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6', maxWidth: 170, fontSize: 12, height: 50, flex: 'center', borderRadius: 0}} containerElement='label' label="Manage Students"  containerElement={<Link to="/managestudents"/>} />
                      <FlatButton  labelStyle={{lineHeight: 4}} style={{borderTop: 'solid 1px #E6E6E6',borderLeft: 'solid 1px #E6E6E6', borderRight: 'solid 1px #E6E6E6', maxWidth: 170, fontSize: 12, height: 50, flex: 'center', borderRadius: 0}} containerElement='label' label="Sign Up"  containerElement={<Link to="/manageusers"/>} />
                      <IconButton  onTouchTap={this.props.handleLogout}  iconStyle={{height: 48}} style={{maxWidth: 100, alignSelf: 'center'}} ><LogoutIcon /></IconButton>
                      </div>)  : (<div className="placeholder"></div>) } </div>}
                    />            
                </div>)
    }
};
const mapStateToProps = (store) => {
    return {
        pathbuilderview: store.mainState.pathbuilderview,
    }
}
export default connect(mapStateToProps)(AppNav); 
