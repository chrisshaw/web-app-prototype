import React from 'react';
import Paper from 'material-ui/Paper';
import GroupTabs from './GroupTabs';

const style = {
  width: '100%',
  textAlign: 'center',
};

class PathPaper extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (    
        <div>
          <Paper style={style} zDepth={0}>
              <GroupTabs />
          </Paper>
        </div>
    )}
}

export default PathPaper;