import React, { Component } from 'react';
import {connect } from 'react-redux';
import uuid from 'uuid';
import {Row, Col, Table, Panel} from 'react-bootstrap';


class Results extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
       console.log("initial state", this.props.noResultsMsg);
       this.handleClick=this.handleClick.bind(this);
    }
    handleClick(e,title) {
        // doesnt do anything for now except display title in the logs
       console.log("title: ", title);
    }
   
    render(){

        var component = this;
        console.log(this.props.focusarea, "this.props.focusarea");
        // if there are focus area results then display them
        if (this.props.focusarea){
           
            // create a table with the output data
            var header = <Panel className="focus-area-header">
                
                    <div className="text-center" key={uuid.v4()}><strong><h2 className="text-center">{this.props.focusarea.name}</h2></strong></div>
                    <br />
                    <div className="format-table-content" ><h4>Focus Areas</h4></div>
                    <div className="format-table-content" ><p>A sentence or two of explanation about focus areas...... </p></div>
            </Panel>
            // map each item in the results array
            var resultComponents = this.props.focusarea.focusAreas.map(function(result) {
            //         for a focus area map each objective in the result data array
                    
                    var objComponents = result.playlists[0].objectives.map(function(objresults) {
                        return <li className="format-table-content" key={uuid.v4()}> {objresults.title} </li>
                    })
                    
                    // return <div  key={uuid.v4()}>{objComponents}</div>
                    return <Panel className="focus-area-body results-content" key={uuid.v4()} onClick={(e) => component.handleClick(e, result.title)}>
            
                        <div className="format-table-content"  key={uuid.v4()}><h4> {result.playlists[0].title}</h4></div>
                        <ul   key={uuid.v4()}><p>{objComponents}</p></ul>
                
                    </Panel>
            })
        }

        if (this.props.noResultsMsg){
            var message = <Panel className="focus-area-header">
                        <div className="format-results-msg-item text-center"><em>{this.props.noResultsMsg}</em></div>
                    </Panel>
        } else if (resultComponents) {
                 var message = <div>
                            {header}
                            {resultComponents}
                    </div>
        } else {
            var message = <Panel className="focus-area-header">
                        <div className="format-results-msg-item text-center"><em>Please select a Query Value</em></div>
                    </Panel>

        }
 
        return(
             <div className="margin-top">
                   {message}
             </div>
        )
    }
}


export default Results;
