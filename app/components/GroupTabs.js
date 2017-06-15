import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';

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

class GroupTabs extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
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
    //// GET TABS from results
    // if ((this.props.selectedgrouplist) && (this.props.selectedgrouplist[0] !== null)){
      //  console.log("in tab", this.props.grouplist)
    //   hasGroups = this.props.grouplist;
      var component = this;
      
      // var resultsComponents = this.props.grouplist.map(function(result, index) {
      //   return  <Tab label={result.name} key={index} value={result.id} />
      //  })

      // display any paths   
      // paths is an array of objects
      // each array item is an object with a group, grade, faid, and an array of paths in order
      // this array of paths is what will be displayed in each group tab
      // they just need to be matched  
      var component = this;
      // reset tabs
      // var tabComponents = "";
      if (this.props.paths) {
        var tabComponents = this.props.paths.map(function(result, index) {
                return  <Tab label={result.groupname} key={index} value={index} />
        })
      } 

      // now map the fa details for each group
      // if (this.props.paths) {
      //   var tabComponents = this.props.paths.map(function(result, index) {
      //           return  <Tab label={result.groupname} key={index} value={index} />
      //   })
      // } 


    return  <div key={uuid.v4()}>
                <Tabs
                  onChange={component.handleChange}
                  value={component.state.slideIndex}
                >
                    {tabComponents}
                </Tabs>
                <SwipeableViews
                  index={component.state.slideIndex}
                  onChangeIndex={component.handleChange}
                >
                  <div >
                    <h2 style={styles.headline}>Tabs with slide effect</h2>
                    Swipe to see the next slide.<br />
                  </div>
                  <div style={styles.slide}>
                    slide n°2
                  </div>
                  <div  style={styles.slide}>
                    slide n°3
                  </div>
                </SwipeableViews>
              </div>

  



  }
}

export default GroupTabs;