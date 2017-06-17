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
    // backgroundColor: "#FFFFFF",
    overflowX: 'none',
  },
    chip: {
      margin: 4,
      position: "relative",
      display: "flex",
      overflowX: "auto",
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    // active {
		// 		a {
		// 			color: #fff;
		// 			border-bottom: 2px solid #fff;
		// // 		}
    // tab : {
    //   color: '#808080'
    // }

};

class GroupTabs extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: '0',
    };
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
  componentDidMount(){
    this.setState({
      value: 0,
    });
  }

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
      // if (this.props.paths) {
      //   var tabComponents = this.props.paths.map(function(result, index) {
      //           return  <Tab label={result.groupname} key={index} value={index} />
      //   })
      // } 


      if (this.props.paths) {
        var i = 0;
        var component = this;
        // there will be one results component returned for each pathway / group.
        var resultsComponents = this.props.paths.map(function(result, index) {
                var j = 0;
                // there will be may Focus Areas returned for each pathway / group
                var faComponents = result.results.map(function(fa, index) {
                    
                    // as well as the current FA and Standards
                    /// we need to  get display the next FA and related standards from results
                    // that is what this piece of code does
                    // ****start of next standard part of code  -- maybe make a function and pass
                    // in j, i, result.results (should have access to this.props.path so no need to pass)
                    j++;
                    if (j < result.results.length){
                        // console.log(component.props.paths[i].results[j].focusArea.standardConnections);
                        var nextFA = <Col key={uuid.v4()} className="chip-float"><Chip
                                  key={uuid.v4()}
                                  style={styles.chip}
                                  >
                                  {component.props.paths[i].results[j].focusArea["Focus Area"]}
                                </Chip>
                                </Col>
                        
                        // remove duplicate standards so they arent displayed
                        var newNextStandardsArr = [];
                        var displayNextStandards;
                        newNextStandardsArr.push(component.props.paths[i].results[j].focusArea.standardConnections[0]);

                        for (var k = 1; k < component.props.paths[i].results[j].focusArea.standardConnections.length-1; k++) {
                            // filter out duplicates
                            if (component.props.paths[i].results[j].focusArea.standardConnections[k-1]!== component.props.paths[i].results[j].focusArea.standardConnections[k]){

                                 newNextStandardsArr.push(component.props.paths[i].results[j].focusArea.standardConnections[k]);
                        

                            }
                        }
                        var nextStandards = newNextStandardsArr.map(function(standard, index){
                        
                        return   <Col key={uuid.v4()} className="chip-float"><Chip
                                  key={uuid.v4()}
                                  style={styles.chip}
                                  >
                                  {standard}
                                </Chip>
                                </Col>
                        })
                        
                    }  // ****end of next standard part of code
                     
                    // this is where the standards for a FA are mapped for display
                    // the duplicates are removed as this makes it look better
                    var newStandardsArr = [];
                    newStandardsArr.push(fa.focusArea.standardConnections[0]);
                    for (var k = 1; k < fa.focusArea.standardConnections.length-1; k++) {
                        // filter out duplicates
                        if (fa.focusArea.standardConnections[k-1]!== fa.focusArea.standardConnections[k]){
                              newStandardsArr.push(fa.focusArea.standardConnections[k]);
                        }
                    }
                    // actual mapping of new reduced standards array
                    var faStandards = newStandardsArr.map(function(standard, index){

                        return   <Col  key={uuid.v4()} className="chip-float"><Chip
                                    key={uuid.v4()}
                                    style={styles.chip}
                                    >
                                    {standard}
                                  </Chip>
                                  </Col>
                    })
                

                    /// this return is to facomponent - it displays all the data for one fa within a path
                    return (  <div key={uuid.v4()} className="fa-wrapper"><Row className="fa-tab-view-rows"><Col key={uuid.v4()} md={12}><div key={uuid.v4()} style={styles.slide}>
                                <Row key={uuid.v4()}>
                                  <Col md={3} xs={12}>
                                    <h3  key={uuid.v4()} className='fa-headings'>Focus Area:  </h3>
                                  </Col>
                                  <Col md={9} xs={12}>
                                    <h3  key={uuid.v4()} className='fa-headings'><span className='fa-headings-span'>{fa.focusArea["Focus Area"].toString()}</span></h3>
                                  </Col>
                                </Row>
                                 <hr />
                                <Row key={uuid.v4()}>
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
                                 <Row key={uuid.v4()}>
                                 <div className="chip-float-text">Connected To: </div>
                                  {nextFA}
                                  {nextStandards}
                                </Row>
                                </div>
                                </Col>
                              </Row>
                            </div>)
                     
                  })
        
                  i++; // to get next array item for display
                  // console.log(index, "index / i", i);
                
                
                return (<Tab buttonStyle={{textColor: '#808080'}} key={uuid.v4()} label={result.groupname} value={index} >
                    {faComponents}
                    </Tab>)
        })
      } 



    // return  <div key={uuid.v4()}>
    //             <Tabs>
    //                 {tabComponents}
    //             </Tabs>
    //             {resultsComponents}
    //           </div>

    return  <Tabs inkBarStyle={{background: '#A35FE3'}}
        initialSelectedIndex={0}
        value={this.state.value}
        onChange={this.handleChange}
      >
       
       {resultsComponents}
      
      </Tabs>



  }
}

export default GroupTabs;