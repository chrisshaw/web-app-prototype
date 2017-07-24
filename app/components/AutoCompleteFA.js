import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import helper from '../helper';
import {connect} from 'react-redux';

const dataSourceConfig = {
  text: 'name',
  value: '_key',
};
 let datasource1 = [];
/**
 * Two examples of filtering. The fsirst uses `caseInsensitiveFilter`, the second uses `fuzzyFilter`,
 * and limits the number of results displayed using the `maxSearchResults` property.
 */
class AutoCompleteFA extends Component{
    constructor(props){
        super(props);
        // this.state = { fa: ""}; //setting initial default state
        this.handleSelect = this.handleSelect.bind(this);
        this.state = {textFieldValue: "", searchText: ""}; //setting initial default state
        // this.handleClose = this.handleClose.bind(this);

    }
    //  handleSelect(){
    //     this.setState({searchText: ''})
    // }
   
    //   _handleTextFieldChange(e, dataSource1) {
    //     this.setState({searchText: e})
    //     this.setState({textFieldValue: e})
    //     // make sure a full word supplied is in list
    //     if (dataSource1.indexOf(e) !== -1){
    //         //  helper.updateSelectedGroup(e, false, this.props.dispatch);
    //          helper.updateSelected(e, this.props.queryitem, this.props.dispatch);
    //     }

    // }
    handleSelect(e){
        // this.setState({fa: e})
        console.log("fa???", e);
        this.setState({searchText: e.name})
        // this.setState({textFieldValue: ""})
        console.log(this.props.fa.indexOf(e))
        if (this.props.fa.indexOf(e) !== -1 ){
            console.log("fa", e);
            helper.saveSelectedFA(e, this.props.dispatch);
            // this.setState({searchText: ""})
        } else {
            console.log("no fa")
            helper.saveSelectedFA("", this.props.dispatch);
            
        }    
    }
    render(){
      

        return (<div>
    <AutoComplete
        // onClose={() => this.handleClose(this.state.fa)}
        fullWidth={true}
        // onClose={() => this.handleClose()}
        // menuCloseDelay='1'
        searchText={this.state.searchText}
        onNewRequest={(e) => this.handleSelect(e)}
        dataSourceConfig={dataSourceConfig}
        floatingLabelText="Select from list and hit ENTER"
        filter={AutoComplete.fuzzyFilter}
        dataSource={this.props.fa}
        maxSearchResults={5}
    />
    </div>)

    }
  
}


const mapStateToProps = (store,ownProps) => {
    return {
        fa: store.mainState.fa,
    }
}

export default connect(mapStateToProps)(AutoCompleteFA);