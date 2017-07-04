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
import Edit from 'react-edit-inline';
import helper from '../helper';
import UpdateStudentModal  from './UpdateStudentModal';



const styles = {
    textColor: '#000000',
};

class DataImportStudentTable extends Component {
    constructor(props){
        super(props);
        this.state = { 
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: false,
            height: '90%',
            width: '100%'}
        // this.handleCancel=this.handleCancel.bind(this);
        // this.handleSubmit=this.handleSubmit.bind(this);
        // this.onRowSelection=this.onRowSelection.bind(this);
        // var component = this;
    }


//     state = {
    
//   };


    // handleToggle = (event, toggled) => {
    //     this.setState({
    //     [event.target.name]: toggled,
    //     });
    // }

    // handleChange = (event) => {
    //     this.setState({height: event.target.value});
    // }

    render() {
        var component = this;
        // console.log("selectedRow", this.state.selectedRow)
        // var i = 0;
        // let resultsComponent = [];
        if (this.props.csvdata) {
            var headerComponent =         
            (<TableHeader key={1000}
                displaySelectAll={this.state.showCheckboxes}
                adjustForCheckbox={this.state.showCheckboxes}
                enableSelectAll={this.state.enableSelectAll}
            >
                 <TableRow>
                        <TableHeaderColumn style={{width: '5%', textAlign: 'center', fontSize: 12}} >Row #</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center' ,fontSize: 12}} tooltip="Student ID">{this.props.csvdata[0].studentId}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center', fontSize: 12}} tooltip="First Name">{this.props.csvdata[0].firstName}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center', fontSize: 12}} tooltip="Last Name">{this.props.csvdata[0].lastName}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center', fontSize: 12}} tooltip="Email">{this.props.csvdata[0].email}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center',fontSize: 12}} tooltip="Section Name">{this.props.csvdata[0].section}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center', fontSize: 12}} tooltip="Course Name">{this.props.csvdata[0].course}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center', fontSize: 12}} tooltip="Mentor Name">{this.props.csvdata[0].mentor}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center',fontSize: 12}} tooltip="Focus Area Name">{this.props.csvdata[0].faName}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '10%', textAlign: 'center', fontSize: 12}} tooltip="Focus Area Type">{this.props.csvdata[0].faType}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '5%', textAlign: 'center', fontSize: 12}} tooltip="Mastered?">{this.props.csvdata[0].mastered}</TableHeaderColumn>
                 </TableRow>
                </TableHeader>)
        var  resultsComponent = component.props.csvdata.map( function (row, index){
                if (index > 0){
                    return (<TableRow key={index}>
                        <TableRowColumn style={{width: '5%', textAlign: 'center', fontSize: 10}}>{row.id}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.studentId}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.firstName}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.lastName}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.email}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.section}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.course}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.mentor}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center', fontSize: 10}}>{row.faName}</TableRowColumn>
                        <TableRowColumn style={{width: '10%', textAlign: 'center',  fontSize: 10}}>{row.faType}</TableRowColumn>
                        <TableRowColumn style={{width: '5%', textAlign: 'center',  fontSize: 10}}>{row.mastered}</TableRowColumn>
                </TableRow>)     
                }        
            })
        }
        return (
        <div>
        <Table
          height={this.state.height}
          width={this.state.width}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this.onRowSelection}
        >
                {headerComponent}
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

export default connect()(DataImportStudentTable);

