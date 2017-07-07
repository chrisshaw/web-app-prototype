import React, { Component } from 'react';
import {connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Grid, Row, Col} from 'react-bootstrap';
import helper from '../helper';
import uuid from 'uuid';
import DataImportStudentTable from './DataImportStudentTable';
import AutoCompleteCSVFAField from './AutoCompleteCSVFAField';
import ReactDOM from "react-dom";

const style = {
    paper : {
        height: '80%',
        width: '100%',
        margin: 20,
        textAlign: 'center',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
        display: 'block',
    },
};

class DataImportStudentCSV extends Component{
    constructor(props){
        super(props);
        this.handleUploadFile = this.handleUploadFile.bind(this);  
        this.handleSaveFile = this.handleSaveFile.bind(this);  
    }
    componentWillMount(){
        // reset datasaved value to hide the messages 
        helper.dataUploadStatus("", "", this.props.dispatch);
    }
    handleUploadFile(e){
        // send to server
        helper.submitCSVFile(e, this.props.dispatch);
        // reset datasaved value to hide the messages 
        helper.dataUploadStatus("", "", this.props.dispatch);
        // reset input value
        var node = ReactDOM.findDOMNode(this.inputEntry);
        node.value="";
    }
    handleSaveFile(){
        // save the displayed data to the server
        helper.saveCSVStudentData(this.props.csvdata, this.props.dispatch);
    }
    render(){
        // add a save button and a clear button
        var previousProblemFA = [];
        console.log(this.props.error)
        if (this.props.error){
            var problemFA = this.props.error.map( function (row, index){
                console.log("previousProblemFA", previousProblemFA, "rwo", row);
                if (previousProblemFA !== row){
                     return <p key={index} className="text-center">{row}</p>
                }
                previousProblemFA = [...row];
            }) 

        }
        return( 
            <div>
                <Row>
                    <Col xs={12} md={12}>
                      {this.props.csvdata ? (<Paper className="data-import-paper" style={style.paper} zDepth={3} >
                            <DataImportStudentTable csvdata={this.props.csvdata} />
                        </Paper>) : ""}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12}>
                        <p className={(this.props.datasaved === true) ? "text-center" : "text-center hidden-class "}><strong>Data uploaded Successfully!</strong></p>
                        <p className={(this.props.datasaved === false) ? "text-center" : "text-center hidden-class "}><strong>Error! Problem saving data, please try again or contact support if the problem persists.</strong> </p>
                        <div className={(this.props.error) ? "text-center" : "text-center hidden-class "}>
                        The following Focus Area names do not exist in the database.
                        {problemFA} 
                        </div>
                    </Col>
                </Row>
                {this.props.csvdata ? ( <Row>
                    <Col xs={2} md={4} />
                    <Col xs={8} md={4} >
                        <FlatButton
                        label="Save Data"
                        secondary={true}
                        style={style.button}
                        type="submit"
                        containerElement='label'
                        onTouchTap={this.handleSaveFile}
                        />
                    </Col>
                    <Col xs={2} md={4} />
                </Row> ) : "" }
                <Row>
                    <Col xs={2} md={4} />
                    <Col xs={8} md={4} >
                        <RaisedButton
                        label="Upload File"
                        secondary={true}
                        style={style.button}
                        type="submit"
                        containerElement='label' 
                        icon={<FontIcon className="muidocs-icon-navigation-expand-more" />}>
                        <input type="file" style={{ display: 'none' }} ref={el => this.inputEntry = el}  onChange={e => this.handleUploadFile(e)}/>
                        </RaisedButton>
                    </Col>
                    <Col xs={2} md={4} />
            </Row>
            </div>
            
        )
    }
}

const mapStateToProps = (store,ownProps) => {
    return {
        csvdata: store.uploadState.csvdata,
        datasaved: store.uploadState.datasaved,
        error: store.uploadState.error,
    }
}

export default connect(mapStateToProps)(DataImportStudentCSV);

