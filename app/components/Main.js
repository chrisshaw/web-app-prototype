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
    textColor: '#FFFFFF',
    // this one is for the tabs bar
    primary1Color: "#2FBB2F",
    // primary2Color:  "#2FBB2F",
    // primary3Color: grey400,
    // this one overrides the underline in tabs
    accent1Color: "#E91E63",
    // accent2Color: grey100,
    // accent3Color: grey500,
    // alternateTextColor: white,
    // canvasColor: white,
    // borderColor: grey300,
    // disabledColor: fade(darkBlack, 0.3),
    // pickerHeaderColor: cyan500,
    // clockCircleColor: fade(darkBlack, 0.07),
    // shadowColor: fullBlack,
  },
  appBar: {
    top: 0,
    // position: "fixed",
    height: 190, 
  },
  paper: {
    color: '#000000'
  },
  table: {
    color: '#000000',
    textColor: '#000000',
  },
  drawer : {
    color: '#BDBDBD',
    textColor: '#000000',
    // zIndex: 100,
    position: 'fixed',
    top: '430px',
    width: '430px'

  }
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

const mapStateToProps = (store,ownProps) => {
    return {
        area: store.mainState.area,
        noResultsMsg: store.mainState.noResultsMsg,
        fadetail: store.mainState.fadetail,
    }
}
export default connect(mapStateToProps)(Main);

