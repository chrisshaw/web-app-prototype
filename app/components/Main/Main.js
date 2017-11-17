import React, { Component } from 'react';
import { connect } from 'react-redux'
import helper from '../../helper';
import NavBar from '../NavBar/NavBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Style from './Main.css'

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
    
    render(){
         return (
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
        )
    }
}

const mapStateToProps = (store) => {
    return {
        loggedIn: store.authState.loggedIn,
        userId: store.authState.userId,
        username: store.authState.username,
        permissions: store.authState.permissions,
        role: store.authState.role
    }
}
export default connect(mapStateToProps)(Main);

