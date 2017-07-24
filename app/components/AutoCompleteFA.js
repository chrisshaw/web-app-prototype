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
        // this.handleClose = this.handleClose.bind(this);

    }
    handleSelect(e){
        // this.setState({fa: e})
        console.log("fa", e);
        console.log(this.props.fa)
        if (this.props.fa.indexOf(e) !== -1 ){
                    console.log("fa", e);
            helper.saveSelectedFA(e, this.props.dispatch);
        }        
    }
    // handleClose(fa){
    //     console.log("handle close", this.state.fa)
        
    // }
   render(){
      

       return (<div>
    <AutoComplete
        // onClose={() => this.handleClose(this.state.fa)}
        fullWidth={true}
        // onClose={() => this.handleClose()}
        // menuCloseDelay='1'
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
        // searching: store.mainState.searching,
        // changed: store.mainState.changed,
    }
}



export default connect(mapStateToProps)(AutoCompleteFA);