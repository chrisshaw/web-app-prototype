import React, {Component} from 'react';
import Chip from 'material-ui/Chip';
import uuid from 'uuid';
/**
 * An example of rendering multiple Chips from an array of values. Deleting a chip removes it from the array.
 * Note that since no `onTouchTap` property is defined, the Chip can be focused, but does not gain depth
 * while clicked or touched.
 */
 class SubjectContentChip extends Component {

  constructor(props) {
    super(props)
    //  console.log("in render", this.props.grouplist)
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
    // console.log("in chip this.props.selectedsubjectcontentlist", this.props.selectedsubjectcontentlist);
    // if (this.props.subjectcontentlist){
    //    hasGroups = this.props.subjectcontentlist;
    // }
    // var selectedArr = [];
    // selectedArr = [...this.props.selectedgrouplist];
    // console.log("what is " , this.props.selectedgrouplist)
    if (this.props.selectedsubjectcontentlist) {
    // || (Object.keys(this.props.selectedgrouplist).length === 0 && this.props.selectedgrouplist.constructor === Object)){
    // }  else {
        // console.log("what is this", this.props.selectedgrouplist)
        var component = this;
        var resultComponents = this.props.selectedsubjectcontentlist.map(function(result) {
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
         {resultComponents} 
      </div>
    );
  }
}


export default SubjectContentChip;