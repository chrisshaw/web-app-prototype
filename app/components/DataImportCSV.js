import React, { Component } from 'react';
import {connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {Grid, Row, Col} from 'react-bootstrap';

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
    margin: 12,
    background: "#2FBB2F"
  },
};

class DataImportCSV extends Component{
    constructor(props){
        super(props);
        // injectTapEventPlugin();

    }
    handleTouchTap(){
        alert("ok do something now!")
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
                    <Col xs={4} md={4} />
                    <Col xs={4} md={4} >
                        <RaisedButton
                        target="_blank"
                        label="Github Link"
                        onTouchTap={this.handleTouchTap}
                        secondary={true}
                        style={style.button}
                        icon={<FontIcon className="muidocs-icon-file-upload" />}
                        />
                    </Col>
                    <Col xs={4} md={4} />
            </Row>
            </Grid>
            
        )
    }
}

export default DataImportCSV;

