import React, { Component } from 'react';
import {connect } from 'react-redux';
import uuid from 'uuid';


class Results extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state

    }
   
    render(){

        var component = this;
        console.log('my focuse areas: ',this.props.area);   
        if (this.props.area){
          

    
            var grade =   this.props.area.grade;
            var title =  this.props.area.title;
            var resultComponents = this.props.area.objectives.map(function(result) {
                    return <div key={uuid.v4()}> {result}</div>

            })


        }
        
        return(

             <div className="margin-top">
                Grade: {grade}
                <br />
                Title: {title}
                <br />
                {resultComponents}
                </div>
        )
    }
}

const mapStateToProps = (store,ownProps) => {

    return {
        area: store.mainState.area,
        
    }

}
export default connect(mapStateToProps)(Results);
