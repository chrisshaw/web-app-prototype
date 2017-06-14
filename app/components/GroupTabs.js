import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

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
    if ((this.props.grouplist) && (this.props.grouplist[0] !== null)){
      //  console.log("in tab", this.props.grouplist)
    //   hasGroups = this.props.grouplist;
      var component = this;
      var tabComponents = this.props.grouplist.map(function(result, index) {
        return  <Tab label={result.name} key={index} value={result.id} />
       })
      var resultsComponents = this.props.grouplist.map(function(result, index) {
        return  <Tab label={result.name} key={index} value={result.id} />
       })
    } 
    
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
            {tabComponents}
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div>
            <h2 style={styles.headline}>Tabs with slide effect</h2>
            Swipe to see the next slide.<br />
          </div>
          <div style={styles.slide}>
            slide n°2
          </div>
          <div style={styles.slide}>
            slide n°3
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default GroupTabs;