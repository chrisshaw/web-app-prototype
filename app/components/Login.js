import React, { Component } from 'react';
import {connect } from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import helper from '../helper';

class Login extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this); 
        this.handleRegister = this.handleRegister.bind(this); 
        this.state = {email: '', password : ''}
    }
    handleChange(e) {
        console.log(e.target.type);
        if (e.target.type === 'email') {
            this.setState({email: e.target.value})
        }
        if (e.target.type === 'password') {
            this.setState({password: e.target.value})
        }
    }
    handleLogin(){
        // looks at this.props.displayname and decides what to do login or signup!
        helper.loginOrRegister(this.state.email, this.state.password, "Login", this.props.dispatch);
    }
    handleRegister(){
        // looks at this.props.displayname and decides what to do login or signup!
        helper.loginOrRegister(this.state.email, this.state.password, "Sign Up", this.props.dispatch);
    }
    render(){
        return( 
            <div className="form-signin">
                <Row>
                    <h4 className="form-signin-heading"></h4>
                </Row>
                <Row>
                    <label htmlFor="inputEmail" className="sr-only">Email</label>
                    <input value={this.state.email} onChange={(e)=>this.handleChange(e)} type="email" id="inputEmail" className="form-control auth-input" placeholder="Email address" required="" autoFocus="" />
                </Row>
                <Row>
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input value={this.state.password} onChange={(e)=>this.handleChange(e)} type="password" id="inputPassword" className="form-control  auth-input" placeholder="Password" required="" />
                </Row>
                <Row>
                    <Col xs={6} md={6} className="text-center">
                        <RaisedButton secondary={true} containerElement='label' onTouchTap={this.handleLogin}  label="Login" />
                    </Col>
                    <Col xs={6} md={6} className="text-center">
                        <RaisedButton  secondary={true} containerElement='label' onTouchTap={this.handleRegister} label="Sign Up" />
                    </Col>
                </Row>
            </div>
  
            
        )
    }
}


export default Login;


