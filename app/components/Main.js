import React, { Component } from 'react';
import {connect } from 'react-redux';
import QueryBuilder from './QueryBuilder';
import helper from '../helper';
import {Grid, Row, Col} from 'react-bootstrap';
import AppNav from './AppNav.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
//
const navBarTheme = getMuiTheme({
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
    alternateTextColor: '#FFFFFF',
    disabledColor: '#E6E6E6',
  },
  appBar: {
    top: 0,
    backgroundColor: '#FFFFFF',
    height: 130, 
  },
  table: {
    border: '1px #E6E6E6 solid',
    color: '#808080',
  },
  drawer : {
    position: 'fixed',
    top: '430px',
    width: '430px'
  },
  chip: {
      backgroundColor: '#A35FE3',
      textColor: '#FFFFFF',
      deleteIconColor: 'rgba(255,255,255,.26)',
      
  },
  raisedButton : {
    textColor: '#FFFFFF',
    backgroundColor: '#40C83C',
  },
  flatButton : {
    textColor: '#40C83C',
    backgroundColor: '#FFFFFF',
  },
  tabs : {
    textColor: '#808080',
  },
  zIndex: {
      dialogOverlay: 1400,
      dialog: 1500,
      drawer: 1300,
  },
  
});
class Main extends Component{
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        injectTapEventPlugin();
    }
    handleLogout(){
      helper.logout(this.props.dispatch, this.props.router);
    }
    render(){
         return(
            <MuiThemeProvider muiTheme={navBarTheme}>
            <div>
                <AppNav pathname={this.props.location.pathname} handleLogout={this.handleLogout} loggedin={this.props.loggedin} perms={this.props.perms} />
                <div className="wrapper">          
                   {React.cloneElement(this.props.children, {username: this.props.username})}
              </div>
            </div>
            </MuiThemeProvider>
        )
    }
}
// {React.cloneElement(this.props.children, {fadetail: this.props.fadetail, focusarea: this.props.area, noResultsMsg: this.props.noResultsMsg})}
const mapStateToProps = (store) => {
    return {
        loggedin: store.authState.loggedin,
        username: store.authState.username,
        perms: store.authState.perms,
        role: store.authState.role,
    }
}
export default connect(mapStateToProps)(Main);

