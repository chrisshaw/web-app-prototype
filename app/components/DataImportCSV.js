import React, { Component } from 'react';
import {connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Grid, Row, Col} from 'react-bootstrap';
import helper from '../helper';

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
    backgroundColor: "#2FBB2F"
  },
};

class DataImportCSV extends Component{
    constructor(props){
        super(props);
        // injectTapEventPlugin();

    }
    handleTouchTap(e){
        // alert("ok do something now!")
        // console.log(e.target.files)
        // capture file - now do something with it
        helper.submitCSVFile(e);

    }
    render(){
        return(
            <Grid>  
                <Row>
                    <Col xs={12} md={12}>
                        <Paper className="data-import-paper" style={style} zDepth={3} >
                            contains a table
                        </Paper>
                    </Col>
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
                        <input type="file" style={{ display: 'none' }} onChange={e => this.handleTouchTap(e)}/>
                        </RaisedButton>
                    </Col>
                    <Col xs={2} md={4} />
            </Row>
            </Grid>
            
        )
    }
}

export default DataImportCSV;

