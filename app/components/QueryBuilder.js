import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import PathBuilderDrawer from './PathBuilderDrawer.js';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {connect } from 'react-redux';

// const style = {
//     drawer: {
//         color: '#808080',
//         zIndex: 100,
//         position: 'fixed',
//         top: '300px'
//     },
//     span: {
//         color: '#FFFFFF',
    
//     },
//     button: {
//         marginTop: 12,
//         marginBottom: 12,
//         // display: 'block',
//         backgroundColor: "#2FBB2F"
//     }
// }

class QueryBuilder extends Component{
   constructor(props) {
        super(props);

    }

    render(){

        
        return(
            <div>
                BuildQueryhere!!!
            </div>
        )
    }
}

// export default PathBuilder;

const mapStateToProps = (store,ownProps) => {
    return {
        toggledrawer: store.mainState.toggledrawer,
    }
}

export default connect(mapStateToProps)(QueryBuilder);

