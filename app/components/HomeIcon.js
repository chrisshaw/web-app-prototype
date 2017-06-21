import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon'; 


class HomeIcon extends Component{
    constructor(props){
        super(props);
        // this.state = {}; //setting initial default state
        // this.handleClick=this.handleClick.bind(this);
    }

    render() {
        return(<svg fill="#808080" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>
)
    }
}


export default HomeIcon;