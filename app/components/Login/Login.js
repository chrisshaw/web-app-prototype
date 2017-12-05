import React from 'react';
// import SwipeableViews from 'react-swipeable-views';
import LoginForm from '../LoginForm/LoginForm';
// import {browserHistory} from "react-router";
// import { connect } from 'react-redux';
import Style from './Login.css'
// import { push } from 'react-router-redux';


const Login = props => (
    <main className={Style.login}>
        <LoginForm router={this.props.router} />  
    </main>
);

export default Login;