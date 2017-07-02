import React, {Component} from 'react';
import Chip from 'material-ui/Chip';
/**
 * An example of rendering multiple Chips from an array of values. Deleting a chip removes it from the array.
 * Note that since no `onTouchTap` property is defined, the Chip can be focused, but does not gain depth
 * while clicked or touched.
 */
 class TopicChip extends Component {

   constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(id) {
    this.props.handleRequestDelete(id);
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
    if (this.props.topiclist){
       hasGroups = this.props.topiclist;
    }
    if (this.props.selectedtopiclist) {
        var component = this;
        var resultComponents = this.props.selectedtopiclist.map(function(result) {
          return <Chip
              key={result._id}
              onRequestDelete={() => component.onDelete(result._id)}
              style={styles.chip}
              >
              {result.name}
            </Chip>
          })
      }   
    return (
      <div style={styles.wrapper}>       
         {resultComponents} 
      </div>
    );
  }
}


export default TopicChip;