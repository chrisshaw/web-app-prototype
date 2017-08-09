import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon'; 


class UpIcon extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
        // this.handleClick=this.handleClick.bind(this);
    }

    render() {
        return(<svg fill="#2FBB2F" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
    </svg>)
    }
}


export default UpIcon;