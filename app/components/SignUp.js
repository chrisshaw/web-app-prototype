import React, { Component } from 'react';
import {connect } from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import helper from '../helper';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {email: '', 
                    password : '', 
                    first: '',
                    last: '',
                    company: '',
                    verify: '', 
                    selectedrole:  'Please Select a Role',
                    description: '',
                    error: false, 
                    errorMsg: ""};
    }
    handleChange(e) {
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
        if (e.target.id === 'last') {
            this.setState({last: e.target.value})
        }
        if (e.target.id === 'first') {
            this.setState({first: e.target.value})
        }
        if (e.target.id === 'company') {
            this.setState({company: e.target.value})
        }
        if (e.target.id === 'role') {
            this.setState({selectedrole:  e.target.value })
            this.setState({description : this.props.roles.map((role, index) => {
                if (role.name === e.target.value){
                    return role.description
                }
            })})
            
        }
    }
    handleClose(){ 
        // clear local and server error messages
        if (this.props.loginerror) helper.loginError(false, "", this.props.dispatch);
        // local validation
        if (this.state.error) this.setState({error: false, errorMsg: ""});
    }
    componentWillReceiveProps(nextProps) {
        // reset state unless there is an error - in that case the current and next props will differ
        if (nextProps.loginerror === this.props.loginerror) {
            this.setState({email: '', 
                    password : '', 
                    first: '',
                    last: '',
                    company: '',
                    verify: '', 
                    selectedrole: 'Please Select a Role',
                    description: '',
                    error: false, 
                    errorMsg: ""})
        } 
    }
    handleSubmit(){    
        // handles local and database errors
        if ((!this.state.email) || (this.state.email.length < 8)){
            // error - email required
            let msg = "Please provide a valid email address."
            this.setState({error: true, errorMsg: msg})
            // helper.loginError(false, msg, this.props.dispatch);
       } else if ((!this.state.first) || (this.state.first.length < 2)) {
            // error - first name required
            let msg = "Please provide a valid first name."
            this.setState({error: true, errorMsg: msg})
        } else if ((!this.state.last) || (this.state.last.length < 2)) {
            // error - last name required
            let msg = "Please provide a valid last name."
             this.setState({error: true, errorMsg: msg})
        } else if ((!this.state.company) || (this.state.company.length < 2)) {
            // error - school or company name required
            let msg = "Please provide a valid company or school name."
             this.setState({error: true, errorMsg: msg})
        } else if (this.state.selectedrole === 'Please Select a Role') {
            // error - school or company name required
            let msg = "Please provide a valid application access role for this user."
             this.setState({error: true, errorMsg: msg})
        } else if ((!this.state.password) || (this.state.password.length < 8)) {
            // error - password required
            let msg = "Please provide a valid password of length 8 characters with one capital letter and at least 2 numbers."
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
            helper.signUpUsers(this.state.email, this.state.password, this.state.first, this.state.last, this.state.company,  this.state.selectedrole, this.props.dispatch,  this.props.router);
        }
    }
    componentWillMount() {
        helper.getRoles(this.props.dispatch);
    }
    render(){
        const actions = [
            <FlatButton
                label="Close"
                onTouchTap={this.handleClose}
            />
            ];
            console.log(this.state.selectedrole)
        if (this.props.roles) {
            var rolesList = this.props.roles.map((role, index) => {
                return  <option key={role._id} value={role.name}>{role.name}</option>     
            });
        }
         console.log("singuppl", this.props.signupok);
        return( 
   
            <div className="form-signin">
               { (this.props.loginerror || this.state.error ) ?  <Dialog
                bodyStyle={{fontSize: 13}}
                titleStyle={{fontSize: 14, fontWeight: 'bold'}}
                title="Sign Up / Login Error"
                actions={actions}
                style={{zIndex: 2000,fontSize: 12, height: 300, width: 350, left: 350}}
                modal={false}
                open= {true}
                onRequestClose={this.handleClose}
                >
                { this.props.loginerror ? this.props.errormsg : this.state.errorMsg }
                </Dialog> : " "}
                { this.props.signupok ? <div className='text-center format-signup-msg-item'>User successfully saved!</div> : ""}
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputEmail" className="sr-only">Email</label>
                        <input value={this.state.email} onChange={(e)=>this.handleChange(e)} id="email" type="email" className="form-control auth-input" placeholder="Email"  autoFocus="" minLength="10"
       maxLength="40" size="40" required />
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputFirstName" className="sr-only">First Name</label>
                        <input value={this.state.first} onChange={(e)=>this.handleChange(e)} id="first" type="text" className="form-control auth-input" placeholder="First Name"  autoFocus="" minLength="10"
       maxLength="40" size="40" required />
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputLastName" className="sr-only">Last Name</label>
                        <input value={this.state.last} onChange={(e)=>this.handleChange(e)} id="last" type="text" className="form-control auth-input" placeholder="Last Name"  autoFocus="" minLength="10"
       maxLength="40" size="40" required />
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputCompany" className="sr-only">Company / School</label>
                        <input value={this.state.company} onChange={(e)=>this.handleChange(e)} id="company" type="text" className="form-control auth-input" placeholder="Company or School Name"  autoFocus="" minLength="10"
       maxLength="40" size="40" required />
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputRole" className="sr-only">Role</label>
                        <select value={this.state.selectedrole} onChange={(e)=>this.handleChange(e)} id="role"  className="form-control auth-input">
                            <option defaultValue='Please Select a Role'>Please Select a Role</option>
                            {rolesList}
                        </select>
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        {this.state.description}
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                        <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input value={this.state.password} onChange={(e)=>this.handleChange(e)} id="password" type="password" className="form-control auth-input" placeholder="Password" minLength="8"
       maxLength="16" size="16" required />
                        <p className="note-text"><em>* length 8 characters with one capital letter and at least 2 numbers.</em></p>
                    </Col>
                    <Col xs={2} md={2}/>  
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                        <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputPassword" className="sr-only">Verify Password</label>
                        <input value={this.state.verify} onChange={(e)=>this.handleChange(e)}  id="verifypassword" type="password" className="form-control auth-input" placeholder="Verify Password" minLength="8"
       maxLength="16" size="16" required />
                    </Col>
                    <Col xs={2} md={2}/>
                </Row>
                <Row>
                    <Col xs={12} md={12} className="text-center">
                        <RaisedButton style={{margin: 10}} secondary={true} containerElement='label' onTouchTap={this.handleSubmit}  label="Sign Up" />
                    </Col>
                 
                </Row>
            </div>
  
            
        )
    }
}


const mapStateToProps = (store) => {
    return {
        loggedin: store.authState.loggedin,
        roles: store.authState.roles,
        loginerror: store.authState.loginerror,
        errormsg: store.authState.errormsg,
        signupok:  store.authState.signupok,
    }
}
export default connect(mapStateToProps)(SignUp);


