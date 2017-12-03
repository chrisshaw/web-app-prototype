import React from 'react';
// import SwipeableViews from 'react-swipeable-views';
import PasswordForm from '../PasswordForm/PasswordForm';
// import {browserHistory} from "react-router";
import { connect } from 'react-redux';
import Style from './Password.css'
// import { push } from 'react-router-redux';


const Password = props => (
    <main className={Style.password}>
        <PasswordForm router={this.props.router} />  
    </main>
);

export default Password;