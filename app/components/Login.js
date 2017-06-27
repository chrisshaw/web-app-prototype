import React, { Component } from 'react';
import {connect } from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import InputForm from './InputForm';
import muiThemeable from 'material-ui/styles/muiThemeable';
import helper from '../helper';

class Login extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {email: '', password : ''}
    }
    handleChange(e) {
        console.log(e.target.type)
        if (e.target.type === 'email') {
            this.setState({email: e.target.value})
        }
        if (e.target.type === 'password') {
            this.setState({password: e.target.value})
        }
    }
    handleSubmit(){
        // console.log(this.state.email, this.state.password)
        // looks at this.props.displayname and decides what to do login or signup!
        helper.loginOrRegister(this.state.email, this.state.password, this.props.displayname);
    }
    render(){
        return( 
            <div className="form-signin">
                <Row>
                    <h2 className="form-signin-heading">{this.props.displayname}</h2>
                </Row>
                <Row>
                    <label htmlFor="inputEmail" className="sr-only">Email</label>
                    <input value={this.state.email} onChange={(e)=>this.handleChange(e)} type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autoFocus="" />
                </Row>
                <Row>
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input value={this.state.password} onChange={(e)=>this.handleChange(e)} type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
                </Row>
                <Row>
                    <button className="btn btn-lg btn-primary btn-block" onTouchTap={this.handleSubmit}>Sign in</button>
                </Row>
            </div>
  
            
        )
    }
}

export default muiThemeable()(Login);


