import React, { Component } from 'react';
import {connect } from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import helper from '../helper';


class Login extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {email: '', password : '', verify: '', error: false, errorMsg: ''}
    }
    handleChange(e) {
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
    handleClose(){
        this.setState({error: false, errorMsg: ""})
    }
    handleSubmit(){
        // looks at this.props.displayname and decides what to do login or signup     
            if ((!this.state.email) || (this.state.email.length < 10)){
                // error - email required
                let msg = "Please provide a valid email address."
                this.setState({error: true, errorMsg: msg})
            }  else if ((!this.state.password) || (this.state.password.length < 8)) {
               // error - password required
                let msg = "Please provide a valid password of length 8 characters with one capital letter and at least 2 numbers."
                this.setState({error: true, errorMsg: msg})
            } else if ((this.props.action === 'Sign Up') && (!this.state.verify)){
                // error - please verify password
                let msg = "Please verify your password."
                this.setState({error: true, errorMsg: msg})
            } else if ((this.props.action === 'Sign Up') && (this.state.verify !== this.state.password)){
               // error - passwords dont match
                let msg = "Passwords do not match - please verify."
                this.setState({error: true, errorMsg: msg})
            } else {
                // if all ok then submit to server
                helper.loginOrRegister(this.state.email, this.state.password, this.props.action , this.props.dispatch);
                console.log("login error:", this.props.loginerror);
        }
    }

    render(){
        const actions = [
            <FlatButton
                label="Close"
                onTouchTap={this.handleClose}
            />
            ];

        return( 
            <div className="form-signin">
                <Dialog
                title="Sign Up / Login Error"
                actions={actions}
                style={{zIndex: 2000}}
                modal={false}
                open={this.state.error}
                onRequestClose={this.handleClose}
                >
               {this.state.errorMsg}
                </Dialog>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputEmail" className="sr-only">Email</label>
                        <input value={this.state.email} onChange={(e)=>this.handleChange(e)} id="email" type="email" className="form-control auth-input" placeholder="Email address"  autoFocus="" minLength="10"
       maxLength="40" size="40" required />
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                        <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input value={this.state.password} onChange={(e)=>this.handleChange(e)} id="password" type="password" className="form-control auth-input" placeholder="Password" minLength="8"
       maxLength="16" size="16" required />
                    </Col>
                    <Col xs={2} md={2}/>  
                </Row>
                { (this.props.action === "Sign Up") ? (<Row>
                    <Col xs={2} md={2}/>
                        <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input value={this.state.verify} onChange={(e)=>this.handleChange(e)}  id="verifypassword" type="password" className="form-control auth-input" placeholder="Verify Password" minLength="8"
       maxLength="16" size="16" required />
                    </Col>
                    <Col xs={2} md={2}/>
                </Row>) : "" }
                <Row>
                    <Col xs={12} md={12} className="text-center">
                        <RaisedButton style={{margin: 10}} secondary={true} containerElement='label' onTouchTap={this.handleSubmit}  label={this.props.action} />
                    </Col>
                 
                </Row>
            </div>
  
            
        )
    }
}


export default Login;


