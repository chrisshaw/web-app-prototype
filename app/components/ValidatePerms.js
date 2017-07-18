import React, { Component } from 'react';
import {connect } from 'react-redux';
// Higher Order Component

export default function(WrappedComponent){

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
            } else if (this.props.perms.indexOf(this.props.route.auth) === -1 ){
                // if not this path is not in your perms list then get forbidden message
                // console.log('forbidden');
                this.props.router.push('/forbidden');
            }

        }
        componentWillUpdate(nextProps) {
            if(!nextProps.loggedin) {
                // send to login screen
                this.props.router.push('/login')
            }  else if (this.props.perms.indexOf(this.props.route.auth) === -1 ){
                // if not this path is not in your perms list then get forbidden message
                console.log('forbidden');
                this.props.router.push('/forbidden');
            }

        }
        render() {

            return <WrappedComponent {...this.props} />
        }
    }
    // ***** NB <WrappedComponent {...this.props} /> injects the route props into the wrapped compoenent
    // these are needed for routing - if we dont need it can be removed and just return  <WrappedComponent />
    // we need as it also injects login state to container components like BuildPath
    function mapStateToProps(store) {
        return {
            loggedin: store.authState.loggedin,
            perms: store.authState.perms,
        }
    }

    return connect(mapStateToProps)(ValidatePerms)
 
}
