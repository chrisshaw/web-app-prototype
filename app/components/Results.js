import React, { Component } from 'react';
import {connect } from 'react-redux';
import uuid from 'uuid';
import {Row, Col, Table} from 'react-bootstrap';


class Results extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }
   
    render(){

        var component = this;
        // if there are focus area results then display them
        if (this.props.focusarea){
            var name = <div className="text-center" key={uuid.v4()}><strong>{this.props.focusarea.focusAreaInfos.courses[0].name}</strong></div>
            // create a table with the output data
            var header = <tr>
                <td>
                    <div>Focus Areas</div>
                    <div>A sentence or two of explanation about focus areas...... </div>

                </td>
            </tr>
            // map each item in the results array
            var resultComponents = this.props.focusarea.playlists.map(function(result) {
                    // for a focus area map each objective in the result data array
                    var objComponents = result.objectives.map(function(objresults) {
                        return <li key={uuid.v4()}> {objresults} </li>
                    })
                    
                    return <tr  key={uuid.v4()}>
                    <td >
                    
                        <div key={uuid.v4()}> {result.title}</div>
                        <ul key={uuid.v4()}> {objComponents}</ul>
                    </td>
                    </tr>
            })
        }
        
        // basic table structure
        const tableInstance = (
        <Table responsive>
            <thead>
                {header}
            </thead>
            <tbody>
                {resultComponents}
            </tbody>
        </Table>
        );

        return(

             <div className="margin-top">
              
                    <Row>
                        {name}
                    </Row>
                    <Row>
                        {tableInstance}
                    </Row>
              </div>
        )
    }
}


export default Results;
