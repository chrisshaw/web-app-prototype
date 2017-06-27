import React, { Component } from 'react';
import {connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Grid, Row, Col} from 'react-bootstrap';
import helper from '../helper';
import uuid from 'uuid';
import DataImportTable from './DataImportTable';
import AutoCompleteCSVFAField from './AutoCompleteCSVFAField';
import ReactDOM from "react-dom";

const style = {
  height: '80vh',
  width: '80vw',
  margin: 20,
  textAlign: 'center',
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  button: {
    marginTop: 12,
    marginBottom: 12,
    display: 'block',
  },
  paper: {
  }
};

class DataImportCSV extends Component{
    constructor(props){
        super(props);
        this.handleUploadFile = this.handleUploadFile.bind(this);  
        this.handleSaveFile = this.handleSaveFile.bind(this);  
    }
    componentWillMount(){
        // get the focus areas
        helper.getFocusArea(this.props.dispatch);

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
                
                        {(this.props.csvdata) && (this.props.csvdata.length > 0) ? (
                <Row>
                    <Col xs={12} md={3} className="text-center" ><p className="focus-area-change">Update Focus Area to: </p></Col>
            
                    <Col xs={12} md={6}><div><AutoCompleteCSVFAField focusArea={this.props.focusArea} selectedFocusArea={this.props.selectedFocusArea}/></div>

        </Col>
                    <Col xs={12} md={3} />
                </Row>) : ""}
                            
                
                <Row>
                    <Col xs={12} md={12}>
                        <Paper className="data-import-paper" style={style} zDepth={3} >
                            <DataImportTable csvdata={this.props.csvdata}  focusArea={this.props.focusArea} selectedFocusArea={this.props.selectedFocusArea}/>
                        </Paper>
                    </Col>
                </Row>
                <Row>
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
                </Row>
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
        focusArea:  store.mainState.focusArea,
        selectedFocusArea: store.mainState.selectedFocusArea
        
    }
}

export default connect(mapStateToProps)(DataImportCSV);

