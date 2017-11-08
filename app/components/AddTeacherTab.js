import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// import SwipeableViews from 'react-swipeable-views';
import {Grid, Row, Col} from 'react-bootstrap';
import SignUp from './SignUp';
// import {browserHistory} from "react-router";
import {connect} from 'react-redux';

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


class AddTeacherTab extends React.Component {

  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {
      value: 0,
    //   contextTypes: {
    //     router: React.PropTypes.object
    //   }
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
                    <Tab label="Update Teacher Courses" value={0} buttonStyle={{color: "#808080"}}>
                        add teacher panel 
                        see list of teachers then
                        see what courses a teacher has
                        add some 
                        remove some
                    </Tab>
                </Tabs>
            </Col>
            <Col xs={1} md={3}/>
       </Row>
      </div>
    );
  }
}


                    // <Tab label="Sign Up" value={1} buttonStyle={{color: "#808080"}}>           
                    //     <Login action="Sign Up"  />       
                    // </Tab>


export default connect()(AddTeacherTab);