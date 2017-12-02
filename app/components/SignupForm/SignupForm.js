import React, { Component } from 'react';
import {connect } from 'react-redux';
import Button from 'mui-next/Button'
import TextField from 'mui-next/TextField'
import Typography from 'mui-next/Typography'
import helper from '../../helper';
import Style from './SignupForm.css'
import Logo from '../Logo/Logo'

import {
    trySignUpUser
} from '../../actions/auth'

class SignupForm extends Component{

    state = {
        email: '', 
        phone: '',
        password: '', 
        first: '',
        last: '',
        district: '',
        school: '',
        verify: '', 
        selectedRole: '',
        description: '',
        error: false,
        errorMsg: ''
    }

    handleChange = e => {
        if (e.target.id === 'email') {
            this.setState( { email: e.target.value } );
        } else if (e.target.id === 'phone') {
            this.setState( { phone: e.target.value } )
        } else if (e.target.id === 'password') {
            this.setState( { password: e.target.value } )
        } else if (e.target.id === 'verify') {
            this.setState( { verify: e.target.value } )
        } else if (e.target.id === 'last') {
            this.setState( { last: e.target.value } )
        } else if (e.target.id === 'first') {
            this.setState( { first: e.target.value } );
        } else if (e.target.id === 'district') {
            this.setState( { district: e.target.value } );
        } else if (e.target.id === 'school') {
            this.setState( { school: e.target.value } );
        } else if (e.target.id === 'role') {
            this.setState({selectedRole: e.target.value, description: signUpObj.description});
        }
    }

    handleSubmit = () => {    
        if (Object.values(this.state).some( value => !value.length )) {
            this.setState( { error: true, errorMsg: 'Please provide values to all required fields.' } )
            return
        } else if ( (!this.state.password) || (this.state.password.length < 8) ) {
            this.setState( { error: true, errorMsg: 'Passwords must be at least 8 characters with at least 1 capital letter and 2 numbers. No special characters allowed.' } )
            return
        } else if (this.state.verify !== this.state.password) {
            this.setState( { error: true, errorMsg: "Passwords do not match." } )
            return
        } else {
            this.props.trySignUpUser(this.state)
        }
    }

    render(){
        return ( 
            <div className={Style.signupForm}>
                <Logo middle />
                <TextField
                    id="first"
                    label="First"
                    type="text"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />                
                <TextField
                    id="last"
                    label="Last"
                    type="text"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <TextField
                    id="phone"
                    label="Phone"
                    type="tel"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <TextField
                    id="verify"
                    label="Verify Password"
                    type="password"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <TextField
                    id="district"
                    label="Name of District"
                    type="text"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <TextField
                    id="school"
                    label="Name of School"
                    type="text"
                    required
                    onChange={this.handleChange}
                    margin="normal"
                />
                <Button
                    raised
                    onClick={this.handleSubmit}
                    color="primary"
                >
                    Log In
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
        signupok: store.authState.signupok
    }
}
export default connect(
    mapStateToProps,
    {
        trySignUpUser
    }
)(SignupForm);