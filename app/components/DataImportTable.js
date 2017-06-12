import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {connect } from 'react-redux';
import React, { Component } from 'react';
import uuid from 'uuid';

const styles = {
//   propContainer: {
//     width: 200,
//     overflow: 'hidden',
//     margin: '20px auto 0',
//   },
//   propToggleHeader: {
//     margin: '20px auto 10px',
//   },

    textColor: '#000000'
    
  
};


class DataImportTable extends Component {
  state = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: false,
    selectable: true,
    multiSelectable: false,
    enableSelectAll: false,
    deselectOnClickaway: true,
    showCheckboxes: true,
    height: '300px',

  };



  handleToggle = (event, toggled) => {
    this.setState({
      [event.target.name]: toggled,
    });
  };

  handleChange = (event) => {
    this.setState({height: event.target.value});
  };

  render() {
    var component = this;
    if (this.props.csvdata) {
        var resultsComponent = component.props.csvdata.map( function (row, index){
            return (<TableRow key={uuid.v4()}>
                <TableRowColumn style={{color: '#000000'}}>{index}</TableRowColumn>
                <TableRowColumn style={{color: '#000000'}}>{row.name}</TableRowColumn>
                <TableRowColumn style={{color: '#000000'}}>{row.grade}</TableRowColumn>
                <TableRowColumn style={{color: '#000000'}}>{row.focusArea}</TableRowColumn>
              </TableRow>)
        })
        console.log(resultsComponent);

    }
    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow >
              <TableHeaderColumn tooltip="ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="Student Name">Student Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Grade">Grade</TableHeaderColumn>
              <TableHeaderColumn tooltip="Current Focus Area">Current Focus Area</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {resultsComponent}
          </TableBody>
        </Table>
      </div>
    );
  }
}



const mapStateToProps = (store,ownProps) => {
    return {
        csvdata: store.mainState.csvdata,
        
    }
}

export default connect(mapStateToProps)(DataImportTable);

