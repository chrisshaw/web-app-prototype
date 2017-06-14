import React, {Component} from 'react';
import Chip from 'material-ui/Chip';
import uuid from 'uuid';
/**
 * An example of rendering multiple Chips from an array of values. Deleting a chip removes it from the array.
 * Note that since no `onTouchTap` property is defined, the Chip can be focused, but does not gain depth
 * while clicked or touched.
 */
 class GroupChip extends Component {

  constructor(props) {
    super(props)
     console.log("in render", this.props.grouplist)
  }


  render() {
    var styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
    var hasGroups = [];
    if (this.props.grouplist){
      hasGroups = this.props.grouplist;
      var component = this;
      var resultComponents = this.props.grouplist.map(function(result) {
        return <Chip
            key={result.id}
            onRequestDelete={() => component.props.handleRequestDelete(result.id)}
            style={styles.chip}
            >
            {result.name}
          </Chip>

        })
    } 
    
    return (
      <div style={styles.wrapper}>
            {hasGroups.length === 0 &&
              <Chip
            key={uuid.v4}
            style={styles.chip}
            >
            No Groups Found
          </Chip>}          
         {resultComponents} 
      </div>
    );
  }
}


export default GroupChip;