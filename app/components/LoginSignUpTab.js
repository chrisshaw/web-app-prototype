import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import {Grid, Row, Col} from 'react-bootstrap';
import Login from './Login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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

class LoginSignUpTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  render() {
    return (
      <div>
        <Row>
            <Col xs={1} md={3}/>
            <Col xs={10} md={6} className="text-center">
              <Tabs inkBarStyle={{background: '#A35FE3'}} value={this.state.value} initialSelectedIndex={0} onChange={this.handleChange}
                    >
                    <Tab label="Login" value={0} buttonStyle={{color: "#808080"}}>
                        <Login action="Login" dispatch={this.props.dispatch} loginerror={this.props.loginerror} />  
                    </Tab>
                    <Tab label="Sign Up" value={1} buttonStyle={{color: "#808080"}}>           
                        <Login action="Sign Up" dispatch={this.props.dispatch} loginerror={this.props.loginerror}/>       
                    </Tab>
                </Tabs>
            </Col>
            <Col xs={1} md={3}/>
       </Row>
      </div>
    );
  }
}

export default LoginSignUpTab;