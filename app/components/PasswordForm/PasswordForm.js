import React, { Component } from 'react';
import {connect } from 'react-redux';
import Button from 'material-ui/Button'
import { tryChangePassword } from '../../actions/auth'

class PasswordForm extends Component{

    state = { 
        verify: '',
        password : '', 
        error: false, 
        errorMsg: ""
    }

    handleChange = (e) => {
        // sets the local state of the changed data
        if (e.target.id === 'password') {
            this.setState({password: e.target.value})
        }
        if (e.target.id === 'verify') {
            this.setState({verify: e.target.value})
        }
    }

    handleSubmit = () => {    
        // handles local and database error
        if ((!this.state.password) || (this.state.password.length < 8)) {
            // error - password required
            let msg = "Please provide a valid password of length 8 characters with one capital letter and at least 2 numbers. No special characters e.g. %, & * etc."
             this.setState({error: true, errorMsg: msg})
        } else if (!this.state.verify){
            // error - please verify password
            let msg = "Please verify your password."
            this.setState({error: true, errorMsg: msg})
        } else if (this.state.verify !== this.state.password){
            // error - passwords dont match
            let msg = "Passwords do not match - please verify."
            this.setState({error: true, errorMsg: msg})
        } else {
            // if all ok then submit to server
            this.props.tryChangePassword(this.state.password, this.props.router)
        }
    }
        
    render() {
        return ( 
            <div className={Style.passwordForm}>
                <Logo middle />              
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
                <Button
                    raised
                    onClick={this.handleSubmit}
                    color="primary"
                >
                    Save Password
                </Button>
            </div>
        )
    }
}


const mapStateToProps = (store) => {
    return {
        loginError: store.authState.loginError,
        errorMsg: store.authState.errorMsg
    }
}

export default connect(
    mapStateToProps,
    {
        tryChangePassword
    }
)(PasswordForm);


