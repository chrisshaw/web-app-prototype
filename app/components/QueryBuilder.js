import React, { Component } from 'react';
import SearchBar from './SearchBar';
import Results from './Results';
import {Grid, Row, Col} from 'react-bootstrap';
// import {newTodo, deleteTodo} from '../actions';


class QueryBuilder extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
         console.log("initial state", this.props.noResultsMsg);
         console.log("initial state", this.props.focusarea);

    }
    // {React.cloneElement(this.props.children, {focusarea: this.props.area, noResultsMsg: this.props.noResultsMsg})}
    render(){

        return(
            <div>
            <Grid>  
                <Col xs={12} md={4}>
                    <SearchBar />    
                </Col>
                <Col xs={12} md={8} >
                    <Results focusarea={this.props.focusarea} noResultsMsg={this.props.noResultsMsg} />          
                </Col>
            </Grid>
            </div>
        )
    }
}

// const mapStateToProps = (store,ownProps) => {

//     return {
//         area: store.mainState.area,
//         noResultsMsg:  store.mainState.noResultsMsg,
        
//     }

// }
export default QueryBuilder;

