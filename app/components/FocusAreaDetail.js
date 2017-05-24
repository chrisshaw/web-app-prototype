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

        // set this to a variable so the context can be referenced within the map function below
        var component = this;
        console.log(this.props.fadetail);
        // if there are focus area results then display them
        var title = this.props.fadetail.playlists[0].title;
        var description = this.props.fadetail.playlists[0].description;
        var keyTerms =  this.props.fadetail.playlists[0].keyTerms;
        var courses = this.props.fadetail.focusAreaInfos[0].courses[0].name;
        var resultComponents = component.props.fadetail.playlists[0].objectives.map(function(result, index) {


            var objectiveresources = result.resources.map(function(objresource, index) {
                console.log("objresource", objresource);
                return <Row key={uuid.v4()}>
                    
                    <Col md={10} xs={12} key={uuid.v4()}>
                            <Col md={12} xs={12} key={uuid.v4()}><div className="format-table-content" key={uuid.v4()}><h6>{objresource.title}</h6></div></Col>
                            
                            <br />


                    </Col>
          
                    </Row>
            })

                
        return <Row key={uuid.v4()}>
            <Col md={1} key={uuid.v4()}/>
            <Col md={10} xs={12} key={uuid.v4()}>
                <Panel className="focus-area-header" key={uuid.v4()}>
                    <div className="format-table-content" key={uuid.v4()}><h5><strong>Objective {index + 1}</strong></h5></div>
                    <div className="format-table-content" key={uuid.v4()}><h6>{result.title}</h6></div>
                    <hr className="hr-color"/>

                     <div className="format-table-content" key={uuid.v4()}><h5><strong>Resources</strong></h5></div>
                        {objectiveresources}

                </Panel>
            </Col>
            <Col md={1}  key={uuid.v4()}/>
            </Row>
        })

        var resources = component.props.fadetail.playlists[0].introduction.resources.map(function(resource, index) {

            return <Row key={uuid.v4()}>
            <Col md={1} xs={1} key={uuid.v4()}> <a className="text-center" href={resource.contentItem.url}> <span className="glyphicon glyphicon-link" aria-hidden="true"></span></a></Col>
            <Col md={10} xs={10} key={uuid.v4()}>
                  <div key={uuid.v4()}><h6>{resource.title}</h6></div>  
            </Col>
            <Col md={1}  key={uuid.v4()}/>
            </Row>
        })




        return(
             <div className="margin-top">
              <Row className="row-padding">
                <Col md={12} xs={12} >
                    <div className="text-center" ><strong><h3 className="text-center focus-area-detail-header" key={uuid.v4()}>{title}</h3></strong></div>
                </Col>
             </Row>

             <br />
             <Row className="row-padding">
     
                <Col md={4} xs={12} >
 
                        <Panel className="focus-area-header">
                            <h4>Focus Area Details</h4>
                            <br/>
                            <h5>OVERVIEW</h5>
                            <div><p>{description}</p></div>
                            <br/>
                            <h5>KEY TERMS</h5>
                            <div><p>{keyTerms}</p></div>
                            <br/>
                            <h5>Courses</h5>
                            <div><p>{courses}</p></div>
                        </Panel>
                        
                </Col>
               <Col md={8} xs={12} >
                    <Row>
                        <Col md={1}/>
                        <Col md={10} xs={12} >
                            <strong><h4 className="focus-area-detail-header" key={uuid.v4()}>Objectives</h4></strong>
                        </Col>
                        <Col md={1}/>
                    </Row>
                    <Row>
                    <Col md={1} key={uuid.v4()}/>
                    <Col md={10} xs={12} >
                        <Panel className="focus-area-header">
                            <h4>Introductory Materials</h4>
                            <hr/>
                            <h5>Resources</h5>
                            <p>{resources}</p>

                        </Panel>
                    </Col>
                    <Col md={1}  key={uuid.v4()}/>
                    </Row>
                    {resultComponents}
                </Col>
                
            </Row>
             </div>
        )
    }
}


export default FocusAreaDetail;
