import React, { Component } from 'react';
import {Link} from 'react-router';
import {Grid, Row, Col, Button} from 'react-bootstrap';

class Nav extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }
   

    // <Navbar inverse fixedTop toggleNavKey={0} >
    //     <Nav right eventKey={0} onSelect={this.onSelect} > {/* This is the eventKey referenced */}
    //       <NavItem eventKey={1} href="#">Link</NavItem>
    //       <NavItem eventKey={2} href="#">Link</NavItem>
    //     </Nav>
    //   </Navbar>    
    render(){
        return(<div>
                <nav className="navbar navbar-fixed-top">       
                    <div className="container-fluid">
                        <Row className="nav-header">
                            <Col md={12} xs={12} className="custom-nav-left">
                                <img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" />
                            </Col>
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span> 
                            </button>
                        </Row>         
                        <Row className="nav-menu">
                           <div className="collapse navbar-collapse" id="myNavbar">
                                <Col md={1} xs={1}></Col>
                                <Col md={8} xs={5} className="custom-nav-left">
                                    <ul className="nav navbar-nav nav-header">
                                        <li><Link to="/" className="text-center login-items"><span className="glyphicon glyphicon-home"></span> Home</Link></li>
                                        <li><a href="#" className="text-center login-items"><span className="glyphicon glyphicon-home"></span> Navigation X</a></li>
                                    </ul>
                                </Col>
                                <Col xs={1}></Col>
                                <Col md={3} xs={5} className="custom-nav-right text-center">
                                    <ul className="nav navbar-nav nav-header">
                                        <li><a href="#" className="text-center login-items"><span className="glyphicon glyphicon-user"></span> Register</a></li>
                                        <li><a href="#" className="text-center login-items"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                                    </ul>
                                </Col>
                            </div>
                        </Row>
                    </div>
                </nav>
            </div> )
    }
}

export default Nav;
