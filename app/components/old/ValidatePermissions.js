import React, { Component } from 'react';
import {connect } from 'react-redux';
// import { push } from 'react-router-redux';

class ValidatePermissions extends Component {
    constructor(props){
        super(props);
    }

  componentDidMount() {
    // const { dispatch, location } = this.props
    // console.log(this.props);
console.log("this.props.pathname", this.props.pathname)
    if (!this.props.loggedin) {
      // set the current url/path for future redirection (we use a Redux action)
    //   then redirect (we use a React Router method)
      dispatch(setRedirectUrl(this.props.pathname))
    //   browserHistory.replace("/login")
      
    //  this.context.router.history.push('/login')
    //   this.props.dispatch(push('/login'));

    } 
  }

  render() {
    console.log("validate location", this.props.loggedin);
    if (this.props.loggedin) {
      return this.props.children
    } else {
      return null
    }
  }
}

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(store) {
  return {
    loggedin: store.authState.loggedin,
    // currentURL: ownProps.location.pathname
  }
}

export default connect(mapStateToProps)(ValidatePermissions)
