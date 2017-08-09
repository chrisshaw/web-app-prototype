import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon'; 


class RightIcon extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
        // this.handleClick=this.handleClick.bind(this);
    }

    render() {
        return(<svg fill="#2FBB2F" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
    <path d="M0-.25h24v24H0z" fill="none"/>
</svg>)
    }
}


export default RightIcon;