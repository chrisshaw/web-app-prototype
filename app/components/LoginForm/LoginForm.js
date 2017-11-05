import React, { Component } from 'react';
import {connect } from 'react-redux';
import Button from 'mui-next/Button'
import TextField from 'mui-next/TextField'
import Typography from 'mui-next/Typography'
import muiThemeable from 'material-ui/styles/muiThemeable';
import helper from '../../helper';
import Style from './LoginForm.css'
import Logo from '../Logo/Logo'

class LoginForm extends Component{

    state = {
        email: '',
        password: '',
        verify: '',
        error: false,
        errorMessage: ''
    }

    handleChange = e => {
        // sets the local state of the changed data
        if (e.target.id === 'email') {
            this.setState({email: e.target.value})
        }
        if (e.target.id === 'password') {
            this.setState({password: e.target.value})
        }
        if (e.target.id === 'verifypassword') {
            this.setState({verify: e.target.value})
        }
    }

    handleSubmit = () => {    
        // handles local and database errors
        if ((!this.state.email) || (this.state.email.length < 10)){
            // error - email required
            let msg = "Please provide a valid email address."
            this.setState({error: true, errorMsg: msg})
            // helper.loginError(false, msg, this.props.dispatch);
        }  else if ((!this.state.password) || (this.state.password.length < 8)) {
            // error - password required
            let msg = "Please provide a valid password."
             this.setState({error: true, errorMsg: msg})
        } else {
            // if all ok then submit to server
            helper.loginUser(this.state.email, this.state.password,  this.props.dispatch,  this.props.router);
        }
    }

    render(){
        return ( 
            <div className={Style.loginForm}>
                <Logo />
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />                
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <Button
                    raised
                    onClick={this.handleSubmit}
                >
                    <Typography type="button">
                        Log In
                    </Typography>
                </Button>
            </div>
        )
    }
}


const mapStateToProps = (store) => {
    return {
        loggedIn: store.authState.loggedIn,
        loginError: store.authState.loginError,
        errorMsg: store.authState.errorMsg,
    }
}
export default connect(mapStateToProps)(LoginForm);