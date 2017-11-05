import React, { Component } from 'react';
import {connect } from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import helper from '../helper';
import { signUpFields } from '../actions';

var signUpObj = {email: "", 
                    password :"", 
                    first: "",
                    last: "",
                    school:" ",
                    verify:"", 
                    selectedRole: "",
                    description: "",
                    error: false,
                    errorMsg: ""} 
class SignUp extends Component{
    constructor(props){
        super(props);
        this.props.dispatch(signUpFields(signUpObj)); 
        if (this.props.signupFields) {
            signUpObj = { email: this.props.signupFields.email, 
                    password : this.props.signupFields.password, 
                    first: this.props.signupFields.first,
                    last: this.props.signupFields.last,
                    school: this.props.signupFields.school,
                    verify: this.props.signupFields.verify, 
                    selectedRole:  this.props.signupFields.selectedRole,
                    description: this.props.signupFields.description,
                    error: this.props.signupFields.error,
                    errorMsg: this.props.signupFields.errorMsg};  
        }
       
        this.state = signUpObj;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleChange(e) {
        // sets the local state of the changed data
        if (e.target.id === 'email') {
            signUpObj.email = e.target.value;
            this.setState({email: e.target.value});
            this.props.dispatch(signUpFields(signUpObj));
        }
        if (e.target.id === 'password') {
            signUpObj.password =   e.target.value;
            this.setState({password: e.target.value})
            this.props.dispatch(signUpFields(signUpObj));
            // this.setState({password: e.target.value})
        }
        if (e.target.id === 'verify') {
            signUpObj.verify =   e.target.value;
            this.setState({verify: e.target.value})
            this.props.dispatch(signUpFields(signUpObj));
            // this.setState({verify: e.target.value})
        }
        if (e.target.id === 'last') {
            signUpObj.last =   e.target.value;
            this.setState({last: e.target.value})
            this.props.dispatch(signUpFields(signUpObj));
            // this.setState({last: e.target.value})
        }
        if (e.target.id === 'first') {
            signUpObj.first =   e.target.value;
            this.setState({first: e.target.value});
            this.props.dispatch(signUpFields(signUpObj));
            // this.setState({first: e.target.value})
        }
        if (e.target.id === 'school') {
            signUpObj.school =   e.target.value;
            this.setState({school: e.target.value});
            this.props.dispatch(signUpFields(signUpObj));
            // this.setState({company: e.target.value})
        }
        if (e.target.id === 'role') {
            signUpObj.selectedRole =   e.target.value;
            // this.setState({selectedRole:  e.target.value })
            signUpObj.description = this.props.roles.map((role, index) => {
                if (role.name === e.target.value){
                    return role.description
                }
            })
            this.setState({selectedRole: e.target.value, description: signUpObj.description});
            this.props.dispatch(signUpFields(signUpObj));   
        }
    }
    handleClose(){ 
        // clear local and server error messages
        if (this.props.loginError) helper.loginError(false, "", this.props.dispatch);
        // local validation
        if (this.props.signupFields.error) this.setState({error: false, errorMsg: ""});
    }
    // componentWillMount(){
    //             if (this.props.signupFields) {
    //         signUpObj = { email: this.props.signupFields.email, 
    //                 password : this.props.signupFields.password, 
    //                 first: this.props.signupFields.first,
    //                 last: this.props.signupFields.last,
    //                 school: this.props.signupFields.school,
    //                 verify: this.props.signupFields.verify, 
    //                 selectedRole:  this.props.signupFields.selectedRole,
    //                 description: this.props.signupFields.description,
    //                 error: this.props.signupFields.error,
    //                 errorMsg: this.props.signupFields.errorMsg};  
    //     }
         
    // }
    handleSubmit(){    
        // handles local and database errors
        if ((!this.props.signupFields.email) || (this.props.signupFields.email.length < 8)){
            // error - email required
            signUpObj.errorMsg = "Please provide a valid email address for the new username."
            this.setState({error: true, errorMsg: signUpObj.errorMsg})
            signUpObj.error = true;
            this.props.dispatch(signUpFields(signUpObj));
            // helper.loginError(false, msg, this.props.dispatch);
       } else if ((!this.props.signupFields.first) || (this.props.signupFields.first.length < 2)) {
            // error - first name required
            signUpObj.errorMsg = "Please provide a valid first name."
            this.setState({error: true, errorMsg: signUpObj.errorMsg})
            signUpObj.error = true;
            this.props.dispatch(signUpFields(signUpObj));
        } else if ((!this.props.signupFields.last) || (this.props.signupFields.last.length < 2)) {
            // error - last name required
            signUpObj.errorMsg = "Please provide a valid last name.";
            signUpObj.error = true;
             this.setState({error: true, errorMsg: signUpObj.errorMsg})
             this.props.dispatch(signUpFields(signUpObj));
        } else if ((!this.props.signupFields.school) || (this.props.signupFields.school.length < 2)) {
            signUpObj.errorMsg = "Please provide a valid school name.";
            signUpObj.error = true;
            this.setState({error: true, errorMsg: signUpObj.errorMsg})
            this.props.dispatch(signUpFields(signUpObj));
        } else if (this.props.signupFields.selectedRole === 'Please Select a Role') {
            signUpObj.errorMsg =  "Please provide a valid application access role for this user."
            signUpObj.error = true;
             this.setState({error: true, errorMsg: signUpObj.errorMsg})
             this.props.dispatch(signUpFields(signUpObj));
        } else if ((!this.props.signupFields.password) || (this.props.signupFields.password.length < 8)) {
            // error - password required
            signUpObj.errorMsg =  "Please provide a valid password of length 8 characters with one capital letter and at least 2 numbers. No special characters e.g. %, & * etc."      
            signUpObj.error = true;
            this.setState({error: true, errorMsg: signUpObj.errorMsg})
            this.props.dispatch(signUpFields(signUpObj));
        } else if (!this.props.signupFields.verify){
            // error - please verify password
            signUpObj.errorMsg =  "Please verify your password.";
            signUpObj.error = true;
            this.setState({error: true, errorMsg: signUpObj.errorMsg})
            // this.setState({error: true, errorMsg: msg})
            this.props.dispatch(signUpFields(signUpObj));
        } else if (this.props.signupFields.verify !== this.props.signupFields.password){
            // error - passwords dont match
            signUpObj.errorMsg =  "Passwords do not match - please verify."
            signUpObj.error = true;
            // this.setState({error: true, errorMsg: msg})
            this.setState({error: true, errorMsg: signUpObj.errorMsg})
            this.props.dispatch(signUpFields(signUpObj));
        } else {
            // if all ok then submit to server
            helper.signUpUsers(this.props.signupFields.email, this.props.signupFields.password, this.props.signupFields.first, this.props.signupFields.last, this.props.signupFields.school,  this.props.signupFields.selectedRole, this.props.dispatch,  this.props.router);
            // reset fields
            signUpObj = {email: '', 
                        password : '', 
                        first: '',
                        last: '',
                        school: '',
                        verify: '', 
                        selectedRole: 'Please Select a Role',
                        description: '',
                        error: false, 
                        errorMsg: ""};
            this.setState(signUpObj);
            this.props.dispatch(signUpFields(signUpObj));
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
            // console.log(this.props.signupFields.selectedRole)
        if (this.props.roles) {
            var rolesList = this.props.roles.map((role, index) => {
                return  <option key={role._id} value={role.name}>{role.name}</option>     
            });
        } 
        return( 
          
           <div> { this.props.signupFields ? (<div className="form-signin">

                { this.props.signupok ? <div className='text-center format-signup-msg-item'>User successfully saved!</div> : ""}
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputEmail" className="sr-only">Username (Email)</label>
                        <input value={this.state.email} onChange={(e)=>this.handleChange(e)} id="email" type="email" className="form-control auth-input" placeholder="Username (Email)"  autoFocus="" minLength="10"
       maxLength="40" size="40" required />
       <p className="note-text"><em>* Username must be a valid email address.</em></p>
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                    { (this.props.loginError || (this.state.error ))  ?  <Dialog
                        bodyStyle={{fontSize: 13}}
                        titleStyle={{fontSize: 14, fontWeight: 'bold'}}
                        title="Sign Up Error"
                        actions={actions}
                        style={{zIndex: 2000,fontSize: 12, height: 300}}
                        modal={false}
                        open= {true}
                        onRequestClose={this.handleClose}
                        >
                        { this.props.loginError ? this.props.errorMsg : this.state.errorMsg }
                        </Dialog> : " "}
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
                        <label htmlFor="inputSchool" className="sr-only">School</label>
                        <input value={this.state.school} onChange={(e)=>this.handleChange(e)} id="school" type="text" className="form-control auth-input" placeholder="School Name"  autoFocus="" minLength="10"
       maxLength="40" size="40" required />
                    </Col>
                    <Col md={2}/>
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                    <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputRole" className="sr-only">Role</label>
                        <select value={this.state.selectedRole} onChange={(e)=>this.handleChange(e)} id="role"  className="form-control auth-input">
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
                        <p className="note-text"><em>* length 8 characters with one capital letter and at least 2 numbers. No special characters e.g. %, & * etc.</em></p>
                    </Col>
                    <Col xs={2} md={2}/>  
                </Row>
                <Row>
                    <Col xs={2} md={2}/>
                        <Col xs={8} md={8} className="text-center">
                        <label htmlFor="inputVerify" className="sr-only">Verify Password</label>
                        <input value={this.state.verify} onChange={(e)=>this.handleChange(e)}  id="verify" type="password" className="form-control auth-input" placeholder="Verify Password" minLength="8"
       maxLength="16" size="16" required />
                    </Col>
                    <Col xs={2} md={2}/>
                </Row>
                <Row>
                    <Col xs={12} md={12} className="text-center">
                        <RaisedButton style={{margin: 10}} secondary={true} containerElement='label' onTouchTap={this.handleSubmit}  label="Sign Up" />
                    </Col>
                 
                </Row>
            </div>) : ""} </div>
  
            
        )
    }
}


const mapStateToProps = (store) => {
    return {
        loggedIn: store.authState.loggedIn,
        roles: store.authState.roles,
        loginError: store.authState.loginError,
        signupFields: store.authState.signupFields,
        errorMsg: store.authState.errorMsg,
        signupok:  store.authState.signupok,
       
    }
}
export default connect(mapStateToProps)(SignUp);


