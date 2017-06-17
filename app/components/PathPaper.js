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
            <div className={ this.props.path ? "" : "hide"}><p className="no-path-message">No Path Selected, please open the Path Builder to generate learning paths.</p></div>
            <GroupTabs selectedgrouplist={this.props.selectedgrouplist} paths={this.props.paths} />
        </Paper>
    )}
}

export default PathPaper;