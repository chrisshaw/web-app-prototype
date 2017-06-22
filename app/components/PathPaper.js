import React from 'react';
import Paper from 'material-ui/Paper';
import GroupTabs from './GroupTabs';

const style = {
  // height: 100,
  width: '100%',
  textAlign: 'center',
//   display: 'inline-block',
  
};

class PathPaper extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (    
        <Paper style={style} zDepth={0}>
            <GroupTabs />
        </Paper>
    )}
}

export default PathPaper;