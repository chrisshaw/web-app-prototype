import React, { Component } from 'react';
import {connect } from 'react-redux';
import uuid from 'uuid';
import {Row, Col, Table, Panel} from 'react-bootstrap';


class FocusAreaDetail extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }

    render(){
 
        return(
        <div className="margin-top">
            <Row>
                <Col md={1} />
                <Col md={10} xs={12} >
                    <Panel className="focus-area-header">

                        <div className="text-center" ><strong><h2 className="text-center">Focus Area: Name</h2></strong></div>

                        <div className="format-table-content" ><h4>Objective 1 etc</h4></div>
                        <div className="format-table-content" ><p>Details..... </p></div>

                    </Panel>
                </Col>
                <Col md={1} />
            </Row>
              <Row>
                <Col md={1} />
                <Col md={10} xs={12} >
                    <Panel className="focus-area-header">

                        <div className="text-center" ><strong><h2 className="text-center">Focus Area: Name</h2></strong></div>

                        <div className="format-table-content" ><h4>Objective 1 etc</h4></div>
                        <div className="format-table-content" ><p>Details..... </p></div>

                    </Panel>
                </Col>
                <Col md={1} />
            </Row>
                          <Row>
                <Col md={1} />
                <Col md={10} xs={12} >
                    <Panel className="focus-area-header">

                        <div className="text-center" ><strong><h2 className="text-center">Focus Area: Name</h2></strong></div>

                        <div className="format-table-content" ><h4>Objective 1 etc</h4></div>
                        <div className="format-table-content" ><p>Details..... </p></div>

                    </Panel>
                </Col>
                <Col md={1} />
            </Row>
             </div>
        )
    }
}


export default FocusAreaDetail;
