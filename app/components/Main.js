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
        return(
            <div>
              <Nav /> 
                <div className="wrapper">
                    {React.cloneElement(this.props.children, {fadetail: this.props.fadetail, focusarea: this.props.area, noResultsMsg: this.props.noResultsMsg})}
                </div>
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

