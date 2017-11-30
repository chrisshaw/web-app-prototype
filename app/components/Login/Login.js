import React from 'react';
// import SwipeableViews from 'react-swipeable-views';
import LoginForm from '../LoginForm/LoginForm';
// import {browserHistory} from "react-router";
import { connect } from 'react-redux';
import Style from './Login.css'
// import { push } from 'react-router-redux';


class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
      /// Login Tab is wrapped in <Router> so has router props
      // but Login children need to have router props passed in 
      // for programmatic navigation later - not using context as facebook say only use if have to as its unstable API and 
      // may change in later version and break app
        return (
            <main className={Style.login}>
                <LoginForm router={this.props.router} />  
            </main>
        );
    }
}


// **NB: must pass the router prop so can used programmatic navigatin later
// this component does not use HOC in validate props so cannot have these props injectted in via {...props}
// in <HOC {...props}
export default connect()(Login);