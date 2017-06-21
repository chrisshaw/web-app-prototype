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
// import action from '../actions';   


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
    constructor(props){
        super(props);
        // console.log(this);
        // let boundActionCreators = bindActionCreators(updateCSVDataName, dispatch)
        
    //        updateCSV: function(action, id, dispatch){
    //     console.log(action, id);
    //     dispatch(updateCSVDataName(action, id))

    // }

    }
    state = {
        fixedHeader: true,
        fixedFooter: true,
        stripedRows: false,
        showRowHover: false,
        height: '300px',

    };



    handleToggle = (event, toggled) => {
        this.setState({
        [event.target.name]: toggled,
        });
    }

    handleChange = (event) => {
        this.setState({height: event.target.value});
    }
    dataChanged(data) { 
            // the "this"" context is the edit object - use this to grab tabindex
            // console.log(this.tabIndex);
            if (data.name){
                helper.updateCSV(data.name, this.tabIndex, "name", this.dispatch ); 
            } 
            if (data.grade){
                helper.updateCSV(data.grade, this.tabIndex, "grade", this.dispatch ); 
            } 
            // if (data.focusArea){
            //     helper.updateCSV(data.focusArea, this.tabIndex, "focusArea", this.dispatch ); 
            // } 

          
    }
    customValidateText(text) {
        return (text.length > 0 && text.length < 64);
    }
    // csvUpdate() {
    //     console.log("etes", index);
    // }
    render() {
        var component = this;
          console.log("selectedFocusArea table", this.props.selectedFocusArea)
  
        if (this.props.csvdata) {
            console.log("selectedFocusArea table", component.props.selectedFocusArea);
            var resultsComponent = component.props.csvdata.map( function (row, index){
                if (component.props.selectedFocusArea){
                    var displaySelectedFA = component.props.selectedFocusArea
                } else {
                     var displaySelectedFA = row.focusArea;
                }
                return (<TableRow key={uuid.v4()}>
                    <TableRowColumn style={{color: '#000000'}}>
                        <Edit
                            validate={component.customValidateText}
                            activeClassName="editing"
                            text= {row.name}
                            tabIndex={row.id}
                            dispatch={component.props.dispatch}
                            paramName="name"
                            change={component.dataChanged}
                            style={{

                                minWidth: 150,
                                margin: 5,
                                padding: 5,
                                fontSize: 15,
                                outline: 0,
                                border: 0
                            }}
                        />
                </TableRowColumn>
                    <TableRowColumn style={{color: '#000000'}}>
                        <Edit
                            validate={component.customValidateText}
                            activeClassName="editing"
                            text= {row.grade}
                            tabIndex={row.id}
                            paramName="grade"
                            dispatch={component.props.dispatch}
                            change={component.dataChanged}
                            style={{

                                minWidth: 150,
                                margin: 5,
                                padding: 5,
                                fontSize: 15,
                                outline: 0,
                                border: 0
                            }}
                        />
                    </TableRowColumn>
                    <TableRowColumn style={{color: '#000000'}}>
     
                       
                           {displaySelectedFA}
                       
                    </TableRowColumn>
                </TableRow>)
            })
            // console.log(resultsComponent);

        }
        return (
        <div>
            <Table
            height={this.state.height}
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            >
            <TableHeader>
                <TableRow >
                <TableHeaderColumn tooltip="Student Name">Student Name</TableHeaderColumn>
                <TableHeaderColumn tooltip="The Grade">Grade</TableHeaderColumn>
                <TableHeaderColumn tooltip="Current Focus Area">Current Focus Area</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody
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



// const mapStateToProps = (store,ownProps) => {
//     return {
//         csvdata: store.mainState.csvdata,    
//         focusArea:  store.mainState.focusArea,
//         selectedFocusArea: store.mainState.selectedFocusArea,
//     }
// }

export default connect()(DataImportTable);

