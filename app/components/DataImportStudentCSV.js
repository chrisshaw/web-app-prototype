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
        // get the focus areas
        helper.getFocusArea(this.props.dispatch);
        // set this.props.pagebuilderview === true so that title is not displayed and appbar is more responsive for
        // this page on smalle screens
        // helper.showView(false, this.props.dispatch);
    }
    handleUploadFile(e){
        // send to server
        helper.submitCSVFile(e, this.props.dispatch);
        // reset input value
        var node = ReactDOM.findDOMNode(this.inputEntry);
        node.value="";
    }
    handleSaveFile(){
        helper.saveCSVData(this.props.csvdata, this.props.dispatch);
    }
    render(){
        // add a save button and a clear button

        return(
            <Grid>       
                <Row>
                    <Col xs={12} md={12}>
                      {this.props.csvdata ? (<Paper className="data-import-paper" style={style.paper} zDepth={3} >
                            <DataImportStudentTable csvdata={this.props.csvdata} />
                        </Paper>) : ""}
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
                        containerElement='label' // <-- Just add me!
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
                        containerElement='label' // <-- Just add me!
                        icon={<FontIcon className="muidocs-icon-navigation-expand-more" />}>
                        <input type="file" style={{ display: 'none' }} ref={el => this.inputEntry = el}  onChange={e => this.handleUploadFile(e)}/>
                        </RaisedButton>
                    </Col>
                    <Col xs={2} md={4} />
            </Row>
            </Grid>
            
        )
    }
}



const mapStateToProps = (store,ownProps) => {
    return {
        csvdata: store.mainState.csvdata,
        
    }
}

export default connect(mapStateToProps)(DataImportStudentCSV);

