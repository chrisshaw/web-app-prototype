import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import {Grid, Row, Col} from 'react-bootstrap';
import Login from './Login';

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

class LoginSignUpTab extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <Row>
            <Col xs={1} md={3}/>
            <Col xs={10} md={6} className="text-center">
                <Tabs
                onChange={this.handleChange}
                value={this.state.slideIndex}
                >
                <Tab label="Login" value={0} />
                <Tab label="Sign Up" value={1} />
                </Tabs>
                <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this.handleChange}
                >
                <div style={styles.slide}>
                   <Login action="Login" dispatch={this.props.dispatch} />
                </div>
                <div style={styles.slide}>
                    <Login action="Sign Up"  dispatch={this.props.dispatch}/>
                </div>
                </SwipeableViews>
            </Col>
            <Col xs={1} md={3}/>
       </Row>
      </div>
    );
  }
}

export default LoginSignUpTab;