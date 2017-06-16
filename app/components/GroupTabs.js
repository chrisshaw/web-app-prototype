import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';
import Chip from 'material-ui/Chip';
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
    textAlign: 'left',
    height: '200px',
    backgroundColor: "#FFFFFF",
    borderTop: '1px solid',
  },
    chip: {
      margin: 4,
      position: "relative",
      display: "flex"
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
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
      // each array item is an object with a group, grade, faid, and an array of paths in "results" field in order
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


      if (this.props.paths) {
        var i = 0;
        var component = this;
        var resultsComponents = this.props.paths.map(function(result, index) {
                var j = 0;
                var faComponents = result.results.map(function(fa, index) {
                    j++;
                    // console.log('next',component.props.paths[i].results[j].focusArea["Focus Area"]);
                    // to get next FA and related standards from results
                    if (j < result.results.length){
                        // console.log(component.props.paths[i].results[j].focusArea.standardConnections);
                        var nextFA = <Col className="chip-float"><Chip
                                  key={uuid.v4()}
                                  style={styles.chip}
                                  >
                                  {component.props.paths[i].results[j].focusArea["Focus Area"]}
                                </Chip>
                                </Col>
                        
                        // remove duplicate standards so they arent displayed
                        var newNextStandardsArr = [];
                        newNextStandardsArr.push(component.props.paths[i].results[j].focusArea.standardConnections[0]);

                        for (var k = 1; k < component.props.paths[i].results[j].focusArea.standardConnections.length-1; k++) {
                            // filter out duplicates
                            if (component.props.paths[i].results[j].focusArea.standardConnections[k-1]!== component.props.paths[i].results[j].focusArea.standardConnections[k]){

                                 newNextStandardsArr.push(component.props.paths[i].results[j].focusArea.standardConnections[k]);


                            }
                        }
                        var nextStandards = newNextStandardsArr.map(function(standard, index){
                        
                        return   <Col className="chip-float"><Chip
                                  key={uuid.v4()}
                                  style={styles.chip}
                                  >
                                  {standard}
                                </Chip>
                                </Col>
                        })
                         
                        
                        // get data and display
                        // console.log(index, "index /j", j);
                    }
                     
                    var newStandardsArr = [];
                    newStandardsArr.push(fa.focusArea.standardConnections[0]);

                    for (var k = 1; k < fa.focusArea.standardConnections.length-1; k++) {
                        // filter out duplicates
                        if (fa.focusArea.standardConnections[k-1]!== fa.focusArea.standardConnections[k]){

                              newStandardsArr.push(fa.focusArea.standardConnections[k]);


                        }
                    }
                   
                    var faStandards = newStandardsArr.map(function(standard, index){
                      // console.log(standard)
                      return   <Col className="chip-float"><Chip
                                  key={uuid.v4()}
                                  style={styles.chip}
                                  >
                                  {standard}
                                </Chip>
                                </Col>
                    })
                  


                    
                    // console.log(fa.focusArea["Focus Area"].toString());
                    return (<div key={uuid.v4()} style={styles.slide}>
                              <h3 className='fa-headings'>{fa.focusArea["Focus Area"].toString()}</h3>
                                <Row className='fa-chips'>
                                  <Col  className="chip-float" key={uuid.v4()}>
                                    <Chip
                                      key={uuid.v4()}
                                      style={styles.chip}
                                      >
                                      {fa.focusArea.subject}
                                    
                                    </Chip>

                                   
                                  </Col>
                                   {faStandards}
                                 </Row>
                                <div>Connected To: </div>
                                  {nextFA}
                                {nextStandards}
                            
                            </div>)
                     
                  })
        
                  i++; // to get next array item for display
                  // console.log(index, "index / i", i);
                
                
                return (<SwipeableViews  key={uuid.v4()}
                  index={component.state.slideIndex}
                  onChangeIndex={component.handleChange}
                >

                  {faComponents}
                </SwipeableViews>)
        })
      } 

    return  <div key={uuid.v4()}>
                <Tabs
                  onChange={component.handleChange}
                  value={component.state.slideIndex}
                >
                    {tabComponents}
                </Tabs>
                {resultsComponents}
              </div>

  



  }
}

export default GroupTabs;