import React from 'react';
// import SwipeableViews from 'react-swipeable-views';
import SignupForm from '../SignupForm/SignupForm';
// import {browserHistory} from "react-router";
import Style from './Signup.css'
// import { push } from 'react-router-redux';


const Signup = props => (
    <main className={Style.signup}>
        <SignupForm router={props.router} />  
    </main>
)

export default Signup;