import React, { Component } from 'react';
import {Link} from 'react-router';
import {Grid, Row, Col} from 'react-bootstrap';
import Logo from './Logo';

class Nav extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }
   
    render(){
        return(<div>
<nav className="navbar">
  <div className="container-fluid">
    <div >
        <Row>
        <Col md={8} xs={12} className="custom-nav-left">
            <img src="./public/assets/img/sidekick.png" className="logo" />
        </Col>
        <Col md={4} xs={12} className="custom-nav-right">
            <ul className="nav navbar-nav">
                <li><a href="#" className="text-center login-items"><span className="glyphicon glyphicon-user"></span> Parent's Login</a></li>
                <li><a href="#" className="text-center login-items"><span className="glyphicon glyphicon-log-in"></span> Student's Login</a></li>
            </ul>
        </Col>
        </Row>
    </div>

    
    </div>
</nav>
            </div> )
    }
}

export default Nav;
