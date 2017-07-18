import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
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


class Forbidden extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };

  }


  render() {
    return (
      <div>
        <Row>
            <Col xs={1} md={3}/>
            <Col xs={10} md={6} className="text-center">
              Unauthorized!
            </Col>
            <Col xs={1} md={3}/>
       </Row>
      </div>
    );
  }
}


export default Forbidden;