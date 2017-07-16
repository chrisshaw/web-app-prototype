import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// import SwipeableViews from 'react-swipeable-views';
import {Grid, Row, Col} from 'react-bootstrap';
import Login from './Login';
// import {browserHistory} from "react-router";
import {connect} from 'react-redux';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import { push } from 'react-router-redux';


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};


// const muiTheme = getMuiTheme({
//     palette: {
//     textColor: '#808080',
//     // this one is for the tabs bar and appBar 
//     primary1Color: "#FFFFFF",
//     primary2Color: "#FFFFFF",
//     // primary3Color: '#A35FE3',
//     // this one overrides the underline in tabs
//     accent1Color: "#40C83C",
//     accent2Color: '#A35FE3',
//     accent3Color: '#808080',
//     alternateTextColor: '#808080',
//     disabledColor: '#E6E6E6',
    
//   }

// });

class LoginTab extends React.Component {

  constructor(props) {
    super(props);
    console.log("login", this.props);
    this.state = {
      value: 0,
      // contextTypes: {
      //   router: React.PropTypes.object
      // }
    };

  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  render() {
    /// Login Tab is wrapped in <Router> so has router props
    // but Login children need to have router props passed in 
    // for programmatic navigation later - not using context as facebook say only use if have to as its unstable API and 
    // may change in later version and break app
    return (
      <div>
        <Row>
            <Col xs={1} md={3}/>
            <Col xs={10} md={6} className="text-center">
              <Tabs inkBarStyle={{background: '#A35FE3'}} value={this.state.value} initialSelectedIndex={0} onChange={this.handleChange}
                    >
                    <Tab label="Login" value={0} buttonStyle={{color: "#808080"}}>
                        <Login router={this.props.router} />  
                    </Tab>
                </Tabs>
            </Col>
            <Col xs={1} md={3}/>
       </Row>
      </div>
    );
  }
}


// **NB: must pass the router prop so can used programmatic navigatin later
// this component does not use HOC in validate props so cannot have these props injectted in via {...props}
// in <HOC {...props}
export default connect()(LoginTab);