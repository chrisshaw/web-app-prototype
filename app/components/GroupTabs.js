import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';
// import Chip from 'material-ui/Chip';removed as this component slows down rendering on this page
import {Grid, Row, Col} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {connect} from 'react-redux';
import helper from '../helper';
// need to move to next versoin of material ui but until then will use import { Tabs, Tab } from 'material-ui-scrollable-tabs/Tabs';
// import { Tabs, Tab } from 'material-ui-scrollable-tabs/Tabs';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    // padding: 10,
    textAlign: 'left',
    // height: '200px',
    overflowX: 'none',
  },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap',
    },
};

// const muiTheme = getMuiTheme({
//     palette: {
//     textColor: '#808080',
//     // this one is for the tabs bar and appBar 
//     primary1Color: "#FFFFFF",
//     // primary2Color: "#40C83C",
//     // primary3Color: '#A35FE3',
//     // this one overrides the underline in tabs
//     accent1Color: "#40C83C",
//     accent2Color: '#A35FE3',
//     accent3Color: '#808080',
//     alternateTextColor: '#808080',
//     disabledColor: '#E6E6E6',
    
//   },
//     chip: {
//       backgroundColor: '#A35FE3',
//       textColor: '#FFFFFF',
//   },

// });

class GroupTabs extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
    console.log("value", value);
  };
  componentDidMount(){
    this.setState({
      value: 0,
    });
  }
render() {
  return <div></div>}
  render() {
      //// GET TABS from results
      // display any paths   
      // paths is an array of objects
      // each array item is an object with a group, grade, faid, and an array of paths in "results" field in order
      // this array of paths is what will be displayed in each group tab
      // they just need to be matched  
      if (this.props.paths)  {
        // there will be one results component returned for each pathway / group.
        // var tabindex = this.state.value;
        let pathResults = this.props.paths.length;
        // only one path returned
         console.log("this.props.paths.length ", this.props.paths.length )
        if ((pathResults) && (this.props.paths.length > 0)) {
           
          var component = this; 
          var resultsComponents = this.props.paths.map(function(student, index) {
            // there will be may Focus Areas returned for each pathway / group
            console.log("student.fa.length ", student.fa.length )
            if  (student.fa.length > 0) {
              var faComponents = student.fa.map(function(fa, index) {
              // console.log("fa", fa)
                if (fa.nextStd) {
                    var nextStandards = fa.nextStd.map((standard, index) => {
                    return   <Col key={index} className="chip-float"><div className="chip">
                                {standard.toUpperCase()}
                              </div>
                              </Col>
                  });
                }

                if (fa.currentStd) {
                  var currentStandards = fa.currentStd.map((standard, index) => {
                      return   <Col key={index} className="chip-float"><div className="chip">
                                  {standard.toUpperCase()}
                                </div>
                                </Col>
                  });
                }

            
                /// this return is to facomponent - it displays all the data for one fa within a path
                return (  <div  key={index} className="fa-wrapper"><Row className="fa-tab-view-rows"><Col md={12}><div style={styles.slide}>
                            <Row >
                              <Col  md={3} xs={12}>
                                <h3  className='fa-headings'>Focus Area</h3>
                              </Col>
                              <Col  md={9} xs={12}>
                                <p  className='fa-headings-span'>{fa["Focus Area"].toString()}</p>
                              </Col>
                            </Row>
                              <hr />
                            <Row >
                              <Col className="chip-float">
                                <div className="chip">                    
                                  {fa.subject.toUpperCase()}      
                                </div>
                              </Col>
                              {currentStandards}
                            </Row>
                              <Row>
                              <div className="chip-float-text">Connected To</div>
                              <Col  className="chip-float">
                                <div className="chip">
                                  {fa.nextFA}
                                </div>
                              </Col> 
                                {nextStandards}
                            </Row>
                            </div>
                            </Col>
                          </Row>
                        </div>)         
              })

            } else {
              var  faComponents = <p className="no-paths-message"> No path found. Please change search filters and try again.</p>
            }


            return  <Tab key={student.student} label={student.details[0].first +" " + student.details[0].last} value={index}  buttonStyle={{color: "#808080"}}>
                  {faComponents} 
          </Tab>  
          })
       
        }  else {
           var resultsComponents = <Tab label="No Paths" value={0}  buttonStyle={{color: "#808080"}}>
           <p className="no-paths-message"> No Paths Found </p>
           </Tab>
        }
           
      }
      


    return <div>
        {this.props.searching ? (<div>
     
     <div className="loader-location">
     <div className="loader-text">Searching...</div>
      <br />
     <div className="text-center loader"></div></div>
    </div>) : ""}

    <Tabs inkBarStyle={{background: '#A35FE3'}}
        initialSelectedIndex={0}
        tabItemContainerStyle={{whiteSpace: 'wrap'}}
        value={this.state.value}
        onChange={this.handleChange}
      >
    {resultsComponents}
      </Tabs>
    </div>
  
  }
}


const mapStateToProps = (store,ownProps) => {
    return {
        paths: store.mainState.paths,
        searching: store.mainState.searching
    }
}

export default connect(mapStateToProps)(GroupTabs);






      // <Tabs
      //   value={this.state.value}
      //   onChange={this.handleChange}
      // >
      //   <Tab label="Tab A" value="a">
      //     <div>
      //       <h2 style={styles.headline}>Controllable Tab A</h2>
      //       <p>
      //         Tabs are also controllable if you want to programmatically pass them their values.
      //         This allows for more functionality in Tabs such as not
      //         having any Tab selected or assigning them different values.
      //       </p>
      //     </div>
      //   </Tab>
      //   <Tab label="Tab B" value="b">
      //     <div>
      //       <h2 style={styles.headline}>Controllable Tab B</h2>
      //       <p>
      //         This is another example of a controllable tab. Remember, if you
      //         use controllable Tabs, you need to give all of your tabs values or else
      //         you wont be able to select them.
      //       </p>
      //     </div>
      //   </Tab>
      // </Tabs>
  
