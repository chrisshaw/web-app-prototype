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
    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>
</svg>)
    }
}


export default UpIcon;