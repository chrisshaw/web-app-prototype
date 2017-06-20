import React, { Component } from 'react';
import {connect } from 'react-redux';
// import Nav from './Navbar';
import QueryBuilder from './QueryBuilder';
import {Grid, Row, Col} from 'react-bootstrap';
// import {newTodo, deleteTodo} from '../actions';
import MyAppNav from './MyAppNav.js';
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
    // color: '#FFFFFF',
    backgroundColor: '#40C83C',
    // textColor: '#FFFFFF',

  },
  flatButton : {
    textColor: '#40C83C',
    backgroundColor: '#FFFFFF',

  },

  tabs : {
    textColor: '#808080',
    // alternateTextColor: '#808080',
    // alternateTextColor: '#808080',
    // disabledColor: '#808080',
  },
 
  // tab : {
  //   textColor: '#808080'
  // }

//   button: {
//       color: '#000000',
//   }
// //   dialog: {
//       zIndex: 3000,
    //   }
    zIndex: {
        // menu: 1000,
        // appBar: 1100,
        // leftNavOverlay: 1200,
        // leftNav: 1300,
        dialogOverlay: 1400,
        dialog: 1500,
        drawer: 1300,
        // layer: 2000,
        // popover: 5000,
        // snackbar: 2900,
        // tooltip: 3000
    },
 

//   tabs: {
//     top: 190,
//   },
//   tab: {
//     color: "#2FBB2F",
//     textColor: '#FFFFFF',
//   }
});

class Main extends Component{
    constructor(props){
        super(props);
        injectTapEventPlugin();

    }
    
    render(){
        return(
            <MuiThemeProvider muiTheme={navBarTheme}>
            <div>
                <MyAppNav/>
                <div className="wrapper">
                   {this.props.children}
                </div>
            </div>
            </MuiThemeProvider>
        )
    }
}

// <div className="wrapper">
//                     {React.cloneElement(this.props.children, {fadetail: this.props.fadetail, focusarea: this.props.area, noResultsMsg: this.props.noResultsMsg})}
//                 </div>

// const mapStateToProps = (store) => {
//     return {
//         area: store.mainState.area,
//         // noResultsMsg: store.mainState.noResultsMsg,
//         // fadetail: store.mainState.fadetail,
//     }
// }
export default Main;

