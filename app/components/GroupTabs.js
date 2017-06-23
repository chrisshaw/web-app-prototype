import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';
import Chip from 'material-ui/Chip';
import {Grid, Row, Col} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {connect} from 'react-redux';

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

const muiTheme = getMuiTheme({
    palette: {
    textColor: '#808080',
    // this one is for the tabs bar and appBar 
    primary1Color: "#FFFFFF",
    // primary2Color: "#40C83C",
    // primary3Color: '#A35FE3',
    // this one overrides the underline in tabs
    accent1Color: "#40C83C",
    accent2Color: '#A35FE3',
    accent3Color: '#808080',
    alternateTextColor: '#808080',
    disabledColor: '#E6E6E6',
    
  },
    chip: {
      backgroundColor: '#A35FE3',
      textColor: '#FFFFFF',
  },

});

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

      // display any paths   
      // paths is an array of objects
      // each array item is an object with a group, grade, faid, and an array of paths in "results" field in order
      // this array of paths is what will be displayed in each group tab
      // they just need to be matched  
      // var component = this;

      if (this.props.paths)  {
        // var i = 0;
        var component = this;
        var tabindex = this.state.value;
        var groupname = this.props.paths[tabindex].groupname;
        // console.log(this.props.paths)
        // there will be one results component returned for each pathway / group.

        // console.log("Being called", this.props.paths[tabindex].results.length);
        if (this.props.paths[tabindex].results.length > 0) {
          var j = 0;
          // i = 0;
          var start = Date.now();
          // there will be may Focus Areas returned for each pathway / group
          var faComponents = this.props.paths[tabindex].results.map(function(fa, index) {
            //  console.log("tabs fa", result);
            // as well as the current FA and Standards
            /// we need to  get display the next FA and related standards from results
            // that is what this piece of code does
            // ****start of next standard part of code  -- maybe make a function and pass
            // in j, i, result.results (should have access to this.props.path so no need to pass)
            j++;
            if (j < component.props.paths[tabindex].results.length){
              // console.log(component.props.paths[tabindex].results[j].focusArea["Focus Area"]);
                // console.log(component.props.paths[i].results[j].focusArea.standardConnections);
                var nextFA = <Col key={index+200} className="chip-float"><Chip
                          key={index+2000}
                          style={styles.chip}
                          >
                          {component.props.paths[tabindex].results[j].focusArea["Focus Area"]}
                        </Chip>
                        </Col>
                
                // remove duplicate standards so they arent displayed
                var newNextStandardsArr = [];
                var displayNextStandards;
                newNextStandardsArr.push(component.props.paths[tabindex].results[j].focusArea.standardConnections[0]);

                for (var k = 1; k < component.props.paths[tabindex].results[j].focusArea.standardConnections.length-1; k++) {
                    // filter out duplicates
                    if (component.props.paths[tabindex].results[j].focusArea.standardConnections[k-1]!== component.props.paths[tabindex].results[j].focusArea.standardConnections[k]){

                          newNextStandardsArr.push(component.props.paths[tabindex].results[j].focusArea.standardConnections[k]);
                

                    }
                }
                var nextStandards = newNextStandardsArr.map(function(standard, index){
                //  console.log("tabs nextStandards", standard);
                return   <Col key={index+300} className="chip-float"><Chip
                          key={index+3000}
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

                return   <Col key={index+400} className="chip-float"><Chip
                            key={index+4000}
                            style={styles.chip}
                            >
                            {standard}
                          </Chip>
                          </Col>
            })
        

            /// this return is to facomponent - it displays all the data for one fa within a path
            return (  <div  key={index+800} className="fa-wrapper"><Row className="fa-tab-view-rows"><Col md={12}><div style={styles.slide}>
                        <Row >
                          <Col key={index+500} md={3} xs={12}>
                            <h3   className='fa-headings'>Focus Area:  </h3>
                          </Col>
                          <Col key={index+600} md={9} xs={12}>
                            <h3  className='fa-headings'><span className='fa-headings-span'>{fa.focusArea["Focus Area"].toString()}</span></h3>
                          </Col>
                        </Row>
                          <hr />
                        <Row >
                          <Col key={index+700} className="chip-float">
                            <Chip
                              key={index+5000}
                              style={styles.chip}
                              >
                              {fa.focusArea.subject}      
                            </Chip>
                          </Col>
                          {faStandards}
                        </Row>
                          <Row>
                          <div className="chip-float-text">Connected To: </div>
                          {nextFA}
                          {nextStandards}
                        </Row>
                        </div>
                        </Col>
                      </Row>
                    </div>)
              
          })

          // i++; // to get next array item for display
          // console.log(index, "index / i", i);
        console.log("fa end", Date.now()-start);      
          
        } else {
          var faComponents = <p className="no-paths-message"> No paths for {component.props.paths[tabindex].groupname}. Please change search filters and try again.</p>
        }
  

        start = Date.now();
        // console.log("resstart",Date.now());
        var resultsComponents = this.props.paths.map(function(result, index) {
        return <Tab key={index} label={result.groupname} value={index} >
                  {faComponents}
                  </Tab>
        })     
        
        console.log("rs end", Date.now()-start);      
        // })
      } 

 

    return  <MuiThemeProvider muiTheme={muiTheme}><Tabs inkBarStyle={{background: '#A35FE3'}}
        initialSelectedIndex={0}
        value={this.state.value}
        onChange={this.handleChange}
      >
       
        {resultsComponents}
      </Tabs></MuiThemeProvider>
  }
}


const mapStateToProps = (store,ownProps) => {
    return {
        paths: store.mainState.paths,

    }
}

export default connect(mapStateToProps)(GroupTabs);