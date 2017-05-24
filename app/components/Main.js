import React, { Component } from 'react';
import {connect } from 'react-redux';
import Nav from './Navbar';
import QueryBuilder from './QueryBuilder';


import {Grid, Row, Col} from 'react-bootstrap';
// import {newTodo, deleteTodo} from '../actions';


class Main extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }
   
    render(){

        // console.log("initial state noResultsMsg", this.props.noResultsMsg);
        // console.log("initial state fadetail", this.props.fadetail);
        // console.log("initial state focusarea", this.props.area);

        return(
            <div>
              <Nav /> 
               {React.cloneElement(this.props.children, {fadetail: this.props.fadetail, focusarea: this.props.area, noResultsMsg: this.props.noResultsMsg})}
            </div>
        )
    }
}


const mapStateToProps = (store,ownProps) => {

    return {
        area: store.mainState.area,
        noResultsMsg: store.mainState.noResultsMsg,
        fadetail: store.mainState.fadetail,
    }

}
export default connect(mapStateToProps)(Main);

