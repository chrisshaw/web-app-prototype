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
        this.handleSubmit = this.handleSubmit.bind(this);
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
    handleSubmit(){
        // looks at this.props.displayname and decides what to do login or signup
        console.log("in here")
        helper.loginOrRegister(this.state.email, this.state.password, this.props.action , this.props.dispatch);
    }

    render(){
        return( 
            <div className="form-signin">
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputEmail" className="sr-only">Email</label>
                        <input value={this.state.email} onChange={(e)=>this.handleChange(e)} type="email" id="inputEmail" className="form-control auth-input" placeholder="Email address" required="" autoFocus="" />
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input value={this.state.password} onChange={(e)=>this.handleChange(e)} type="password" id="inputPassword" className="form-control  auth-input" placeholder="Password" required="" />
                </Col>
                <Col xs={2} md={2}/>
                
                </Row>
                <Row>
                    <Col md={2}/>
                    <Col xs={12} md={4} className="text-center">
                        <RaisedButton style={{margin: 10}} secondary={true} containerElement='label' onTouchTap={this.handleSubmit}  label={this.props.action} />
                    </Col>
                    <Col md={2}/>
                </Row>
            </div>
  
            
        )
    }
}


export default Login;


