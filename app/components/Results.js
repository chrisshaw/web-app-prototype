import React, { Component } from 'react';
import {connect } from 'react-redux';
import uuid from 'uuid';
import {Row, Col, Table, Panel} from 'react-bootstrap';
import {Link} from 'react-router';
import helper from '../helper';
import {viewDetailFocusArea} from '../actions';

class Results extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
       console.log("initial state", this.props.noResultsMsg);
       this.handleClick=this.handleClick.bind(this);
    }
    handleClick(e, id) {
       // this filter of results set is a short term solution for pilot - probably too messy and slow for production
       // we just want the focus area with focusAreaId = selected id
        var faDetail = this.props.focusarea.focusAreas.filter((detail) => {
            // keep only the results that match condition
            if (detail.focusAreaInfos[0].focusAreaId === id){
                return true;
            }
            return false;
        })
        // call function to dispatch detailed results to store
        this.props.viewDetail(faDetail[0]);
    }
   
    render(){
        // ****this is still TEST data so the object structure below will likely change***
        // set this to a variable so the context can be referenced within the map function below
        var component = this;
        // if there are focus area results then display them
        if (this.props.focusarea){
            // create a table with the output data
            // this.props.focusarea.id = course id
            // this.props.focusarea.name = course name
            var header = <Panel className="focus-area-header">
                    <div className="text-center" key={this.props.focusarea.id}><strong><h2 className="text-center">{this.props.focusarea.name}</h2></strong></div>
                    <br />
                    <div className="format-table-content" ><h4>Focus Areas</h4></div>
                    <div className="format-table-content" ><p>A sentence or two of explanation about focus areas...... </p></div>
            </Panel>
            // map each item in the results array
            var resultComponents = this.props.focusarea.focusAreas.map(function(result) {
                    // for a given focus area, map each objective in the result data array
                    var objComponents = result.playlists[0].objectives.map(function(objresults) {
                        return <li className="format-table-content" key={objresults.id}> 
                            {objresults.title} </li>
                    })
                    // for a each course list title and all objectives 
                    // ****this is still TEST data so the object structure may change***
                    return <Panel className="focus-area-body results-content" key={uuid.v4()} onClick={(e) => component.handleClick(e, result.playlists[0].knowDoId)}>
                        <Link to='/detail'><div className="format-table-content"  key={uuid.v4()}><h4> {result.playlists[0].title}</h4></div></Link>
                        <ul key={uuid.v4()}><p>{objComponents}</p></ul>
                
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


// // used to dispatch actions to central store
function mapDispatchToProps(dispatch) {
    return({
        viewDetail: (faDetail) => { dispatch(viewDetailFocusArea(faDetail));}
        
    })
}

export default connect(null, mapDispatchToProps)(Results);
