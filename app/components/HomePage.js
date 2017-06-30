import React,{Component} from 'react';
import Paper from 'material-ui/Paper';

const style = {
  width: '100%',
  textAlign: 'center',
};


class HomePage extends Component {

  constructor(props) {
    super(props);
    
  }

  render() {
    return  <div>
          <Paper style={style} zDepth={0}>
              <p>Write something - maybe instructions? or a video?</p>
          </Paper>
        </div>
  }
}




export default HomePage;