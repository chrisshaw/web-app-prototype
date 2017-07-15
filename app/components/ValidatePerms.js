import React, { Component } from 'react';
import {connect } from 'react-redux';

export default function(HOC){

    class ValidatePerms extends Component {
        constructor(props){
            super(props);
        }
        // note facebook says not to use context as it is unstable api and may change in future releases
        // react router uses it
        // this.props.router.path is passed but Router so can use this but all examples use context
        componentWillMount() {
            if(!this.props.loggedin) { 
                // send to login screen
                this.props.router.push('/login')
            } 
        }
        componentWillUpdate(nextProps) {
            if(!nextProps.loggedin) {
                // send to login screen
                this.props.router.push('/login')
            } 
        }
        render() {
                console.log("in HOC render", this.props);
            return <HOC {...this.props} />
        }
    }
    // ***** NB <HOC {...this.props} /> injects the route props into the wrapped compoenent
    // these are needed for routing - if we dont need it can be removed and just return  <HOC />
    // we need as it also injects login state to container components like BuildPath
    function mapStateToProps(store) {
        return {
            loggedin: store.authState.loggedin,
        }
    }

    return connect(mapStateToProps)(ValidatePerms)
 
}
