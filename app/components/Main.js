import React, { Component } from 'react';
import {connect } from 'react-redux';
import QueryBuilder from './QueryBuilder';
import Login from './Login';
import helper from '../helper';
import {Grid, Row, Col} from 'react-bootstrap';
import AppNav from './AppNav.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


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
  paper: {
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
      helper.logout(this.props.dispatch);
    }
    render(){
      console.log("loggedin",this.props.loggedin)
        return(
            <MuiThemeProvider muiTheme={navBarTheme}>
            <div>
                <AppNav handleLogout={this.handleLogout} loggedin={this.props.loggedin}/>
                <div className="wrapper">
                 
                   { this.props.loggedin ?  this.props.children : (<Grid>                   
                    <Row>       
                    <Col md={4} />
                    <Col md={4} className="text-center">
                       <Login dispatch={this.props.dispatch}/>
                    </Col>
                    <Col md={4} />
                    </Row>
                </Grid> )}
              </div>
            </div>
            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        loggedin: store.authState.loggedin,
    }
}

export default connect(mapStateToProps)(Main);

