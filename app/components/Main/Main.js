import React, { Component } from 'react';
import { connect } from 'react-redux'
import QueryBuilder from '../QueryBuilder';
import helper from '../../helper';
import NavBar from '../NavBar/NavBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import Style from './Main.css'
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
        alternateTextColor: '#40C83C',
        disabledColor: '#E6E6E6',
    },
    appBar: {
        backgroundColor: '#FFFFFF',
    },
    table: {
        border: '1px #E6E6E6 solid',
        color: '#808080',
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
    }    
});

class Main extends Component{
    constructor(props){
        super(props);
        // get initial data
        // helper.getUserFA(this.props.userId, this.props.dispatch);
        injectTapEventPlugin();
    }

    handleLogout = () => {
       helper.logout(this.props.dispatch, this.props.router);
    }
    
    handleClose = () => { 
        // clear local and server error messages
        if (this.props.error) helper.setErrorMsg(this.props);
        // local validation
        if (this.props.success) helper.setSuccessMsg(this.props);
    }
    
    render(){
         return (
            <MuiThemeProvider muiTheme={navBarTheme}>
                <div id="main-container" className={Style.mainContainer}>  
                    { this.props.loggedIn &&
                        <NavBar
                            className={Style.mainContainerHeader}
                            pathname={this.props.location.pathname}
                            handleLogout={this.handleLogout}
                            loggedIn={this.props.loggedIn}
                            permissions={this.props.permissions}
                        />
                    }
                    {React.cloneElement(this.props.children, {username: this.props.username})}
                </div>
            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        loggedIn: store.authState.loggedIn,
        userId: store.authState.userId,
        username: store.authState.username,
        permissions: store.authState.permissions,
        role: store.authState.role,
        success: store.appState.success,
        successMsg: store.appState.successMsg,
        error: store.appState.error,
        errorMsg: store.appState.errorMsg,
    }
}
export default connect(mapStateToProps)(Main);

