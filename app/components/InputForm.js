
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button, Grid, Row, Col} from 'react-bootstrap';


class InputForm extends Component{
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''}
    // this.getValidationState = this.getValidationState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    console.log(e);
    this.setState({ value: e.target.value });
  }

 render(){
   return (

      <form class="form-signin">
          <Row>
            <h2 class="form-signin-heading">Login</h2>
          </Row>
          <Row>
            <label for="inputEmail" class="sr-only">Email address</label>
            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" />
          </Row>
          <Row>
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" />
          </Row>
          <Row>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          </Row>
      </form>
   
)}
    
};

export default InputForm;