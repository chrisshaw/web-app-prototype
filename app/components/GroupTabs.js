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
  };
  componentDidMount(){
    this.setState({
      value: 0,
    });
  }
   componentWillReceiveProps(nextProps) {
    //  console.log((nextProps.paths !== "") || (nextProps.paths !== this.props.paths))
     if ((nextProps.paths !== "") || (nextProps.paths !== this.props.paths))  {
       // updates message to say results found
       helper.pathsRendered(true, this.props.dispatch);
       // reset state
       this.setState({
          value: 0,
        });
    }
  }
  
render() {
  console.log(this.props.path)
  return <div></div>}
  // render() {
  //     //// GET TABS from results
  //     // display any paths   
  //     // paths is an array of objects
  //     // each array item is an object with a group, grade, faid, and an array of paths in "results" field in order
  //     // this array of paths is what will be displayed in each group tab
  //     // they just need to be matched  s
  //    console.log(this.state.value, "this.state.value;")
  //     if (this.props.paths)  {
  //       // there will be one results component returned for each pathway / group.
  //       var tabindex = this.state.value;
  //     //    console.log("paths in grouptabs", this.props.paths[tabindex])
  //       console.log("paths", this.props.paths)
  //       console.log("tabindex", tabindex)
  //       let pathResults = this.props.paths[tabindex].results.length;
  //       if ((pathResults) && (this.props.paths[tabindex].results.length > 0)) {
  //         var component = this; 
  //         var groupname = this.props.paths[tabindex].groupname;
  //         var j = 0;
  //         var start = Date.now();
  //         // there will be may Focus Areas returned for each pathway / group
  //         var faComponents = this.props.paths[tabindex].results.map(function(fa, index) {
  //           // as well as the current FA and Standards
  //           /// we need to  get display the next FA and related standards from results
  //           // that is what this piece of code does
  //           // ****start of next standard part of code  -- maybe make a function and pass
  //           // in j, i, result.results (should have access to this.props.path so no need to pass)

  //           j++;
  //           if (j < component.props.paths[tabindex].results.length){
  //               var nextFA = <Col  className="chip-float"><div className="chip">
  //                         {component.props.paths[tabindex].results[j].focusArea["Focus Area"]}
  //                       </div>
  //                       </Col>           
  //               // remove duplicate standards so they arent displayed
  //               var newNextStandardsArr = [];
  //               var displayNextStandards;
  //               newNextStandardsArr.push(component.props.paths[tabindex].results[j].focusArea.standardConnections[0]);

  //               for (var k = 1; k < component.props.paths[tabindex].results[j].focusArea.standardConnections.length-1; k++) {
  //                   // filter out duplicates
  //                   if (component.props.paths[tabindex].results[j].focusArea.standardConnections[k-1]!== component.props.paths[tabindex].results[j].focusArea.standardConnections[k]){

  //                         newNextStandardsArr.push(component.props.paths[tabindex].results[j].focusArea.standardConnections[k]);
                

  //                   }
  //               }
  //               var nextStandards = newNextStandardsArr.map(function(standard, index){
  //               // console.log("tabs nextStandards", standard);
  //               // should make so every array item has unique key in arango??
  //               return   <Col key={index} className="chip-float"><div className="chip">
  //                         {standard}
  //                       </div>
  //                       </Col>
  //               })
                
  //           }  // ****end of next standard part of code

  //           // this is where the standards for a FA are mapped for display
  //           // the duplicates are removed as this makes it look better
  //           var newStandardsArr = [];
  //           newStandardsArr.push(fa.focusArea.standardConnections[0]);
  //           for (var k = 1; k < fa.focusArea.standardConnections.length-1; k++) {
  //               // filter out duplicates
  //               if (fa.focusArea.standardConnections[k-1]!== fa.focusArea.standardConnections[k]){
  //                     newStandardsArr.push(fa.focusArea.standardConnections[k]);
  //               }
  //           }
  //           // actual mapping of new reduced standards array
  //           var faStandards = newStandardsArr.map(function(standard, index){

  //               return   <Col key={index} className="chip-float"><div className="chip">
  //                           {standard}
  //                         </div>
  //                         </Col>
  //           })

  //           /// this return is to facomponent - it displays all the data for one fa within a path
  //           return (  <div  key={index} className="fa-wrapper"><Row className="fa-tab-view-rows"><Col md={12}><div style={styles.slide}>
  //                       <Row >
  //                         <Col  md={3} xs={12}>
  //                           <h3   className='fa-headings'>Focus Area</h3>
  //                         </Col>
  //                         <Col  md={9} xs={12}>
  //                           <p  className='fa-headings-span'>{fa.focusArea["Focus Area"].toString()}</p>
  //                         </Col>
  //                       </Row>
  //                         <hr />
  //                       <Row >
  //                         <Col className="chip-float">
  //                           <div className="chip">                    
  //                             {fa.focusArea.subject}      
  //                           </div>
  //                         </Col>
  //                         {faStandards}
  //                       </Row>
  //                         <Row>
  //                         <div className="chip-float-text">Connected To</div>
  //                           {nextFA}
  //                           {nextStandards}
  //                       </Row>
  //                       </div>
  //                       </Col>
  //                     </Row>
  //                   </div>)         
  //         })
       
  //       } else {
  //         var faComponents = <p className="no-paths-message"> No paths for {this.props.paths[tabindex].group.name}. Please change search filters and try again.</p>
  //       }
  //       // console.log("tabindex 2", tabindex)
  //       // // increase the index
  //       // tabindex++;
        
  //       var resultsComponents = this.props.paths.map(function(result, index) {
  //       return <Tab key={index} label={result.group.name} value={index}  buttonStyle={{color: "#808080"}}>
  //                 {faComponents}
  //                 </Tab>
  //       })     
    
  //     } 


  //   return <Tabs inkBarStyle={{background: '#A35FE3'}}
  //       initialSelectedIndex={0}
  //       tabItemContainerStyle={{whiteSpace: 'wrap'}}
  //       value={this.state.value}
  //       onChange={this.handleChange}
  //     >
  //       {resultsComponents}
  //     </Tabs>
  // }
}


const mapStateToProps = (store,ownProps) => {
    return {
        paths: store.mainState.paths,
    }
}

export default connect(mapStateToProps)(GroupTabs);