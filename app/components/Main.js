import React, { Component } from 'react';
import {connect } from 'react-redux';
import SearchBar from './SearchBar';
import Results from './Results';
import Nav from './Navbar';


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
            <Grid>  
                <Col xs={12} md={4}>
                    <SearchBar />    
                </Col>
                <Col xs={12} md={8} >
                    <Results focusarea={this.props.area}/>       
                </Col>
            </Grid>
            </div>
        )
    }
}

const mapStateToProps = (store,ownProps) => {

    return {
        area: store.mainState.area,
        
    }

}
export default connect(mapStateToProps)(Main);

