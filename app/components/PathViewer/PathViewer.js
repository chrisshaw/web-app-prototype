import React from 'react';
import ReactDOM from "react-dom";
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';
import {Grid, Row, Col} from 'react-bootstrap';

import { connect } from 'react-redux';
import helper from '../../helper';
import Dialog from 'material-ui/Dialog';
import {Tabs, Tab} from 'material-ui/Tabs';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AutoCompleteFA from './AutoCompleteFA.js';
import UpIcon from './UpIcon.js';
import DownIcon from './DownIcon.js';
import RightIcon from './RightIcon.js';
import LeftIcon from './LeftIcon.js';

import {
  red500,
  grey500,
  greenA700,
} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import FocusAreaDrawer from './FocusAreaDrawer';
import RelatedProjectsDrawer from './RelatedProjectsDrawer';

import { selectFocusArea } from '../actions/focusAreas';
import { selectPath } from '../actions/relatedProjects';

const iconStyles = {
  marginRight: 24,
  fill: 'red500'
};
const styles = {
  iconButton : {
    disabledTextColor: '#808080'
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    textAlign: 'left',
    overflowX: 'none',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  focusAreaHeader: {
    display: 'inline-block',
  },
  focusAreaRelevanceLabel: {
    display: 'inline-block',
    margin: '0 0 7px 12px',
  },
};

// MUI-NEXT MIGRATION
import Button from 'mui-next/Button'
import AutoCompleteFA from '../AutoCompleteFA.js';
import IconButton from 'mui-next/IconButton'
import Icon from 'mui-next/Icon'


class PathViewer extends React.Component {
  constructor(props) {
    super(props);
    this.handleActive = this.handleActive.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddFA = this.handleAddFA.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addRows = this.addRows.bind(this);
    this.handleSelectProject = this.handleSelectProject.bind(this);
    this.handleRemoveProject = this.handleRemoveProject.bind(this);
    this.handleMoveUp = this.handleMoveUp.bind(this);
    this.handleMoveDown = this.handleMoveDown.bind(this);
    this.handleViewDetails = this.handleViewDetails.bind(this);
    this.handleCloseFocusAreaDrawer = this.handleCloseFocusAreaDrawer.bind(this);
    this.handleViewRelatedProjects = this.handleViewRelatedProjects.bind(this);
    this.handleCloseRelatedProjectsDrawer = this.handleCloseRelatedProjectsDrawer.bind(this);
    // get FAlist for current user
  }
  
  state = {
      value: 0,
      showModal: false,
      showDiv: "",
      showTabStart: 0,  // used to scroll thru tabs
      showTabEnd: 4,// used to scroll thru tabs
      isFocusAreaDrawerOpen: false,
      currentFocusArea: {},
      isRelatedProjectsDrawerOpen: false,
  };

  relevance = {
      'Supporting Concept': {
          label: 'Bridge',
          color: grey500,
      },
      'Relevant': {
          label: 'Relevant',
          color: null,
      },
      'Highly Relevant': {
          label: 'Highly Relevant',
          color: greenA700,
      },
  }
  
  handleMoveUp(moveStudentPosition, moveProjPosition, moveFaPosition){
    // console.log("Moved Up", moveStudentPosition, moveProjPosition, moveFaPosition)
    helper.moveFaUp(moveStudentPosition, moveProjPosition, moveFaPosition, this.props)
  }
  handleMoveDown(moveStudentPosition, moveProjPosition, moveFaPosition){
    // console.log("Moved Down", moveStudentPosition, moveProjPosition, moveFaPosition)
    helper.moveFaDown(moveStudentPosition, moveProjPosition, moveFaPosition, this.props)
  }
  handleMoveRight(){
    // console.log("Moved Up", moveStudentPosition, moveProjPosition, moveFaPosition)
    // console.log("this.state.showTabEnd === this.props.paths.length-1", this.state.showTabEnd, this.props.paths.length)
    if (this.state.value < this.props.paths.length-1){
      if (this.state.showTabEnd === this.props.paths.length){
         this.handleChange(this.state.value+1, 0)
      } else {
         this.handleChange(this.state.value+1, 1)
      }
      
// this.setState({
//       showTabStart: this.state.showTabStart+newvalue,
//       showTabEnd: this.state.showTabEnd++newvalue
//     });
    }
    //  console.log(this.refs[selectedtab+index])
    // this.handleActive(this.selectedtab+index)
  }
  handleMoveLeft(){
    // console.log("Moved Up", moveStudentPosition, moveProjPosition, moveFaPosition)
    if (this.state.value > 0){
      if (this.state.showTabStart === 0)
        this.handleChange(this.state.value-1, 0)
      else {
        this.handleChange(this.state.value-1, -1)
      }
    }
    // console.log(this)
    // this.handleActive(this.selectedtab)
  }
  handleChange = (value, delta) => {
    // console.log("showTabStart, delta",this.state.showTabStart, delta)
    // console.log("showTabEnd, delta",this.state.showTabEnd, delta)
    this.setState({
      value: value,
      showTabStart: this.state.showTabStart+delta,
      showTabEnd: this.state.showTabEnd+delta

    });
  };
  handleAdd(studentPosition, projPosition, position){
    // console.log("handleAdd",studentPosition, projPosition, position )
    let ref = studentPosition + '/' + projPosition + '/' + position;  // use these 3 coord to locate fa in array
    this.setState({
      showDiv: ref,  // ref should match coords
    });
  }
  handleDelete(studentPosition, studentKey, faKey, projPosition, position){
      // console.log("handleDelet",studentPosition, projPosition, position )
    // must use keys to find position and delete
    helper.removeFA(studentPosition, projPosition, position, studentKey, faKey, this.props);   
  }
  handleActive = (tab) => {
    // console.log(tab)
    // console.log("Active")
      this.setState({
        value: tab.props.value,
      });
  };
  handleAddFA(studentPosition, studentKey, faKey, projPosition,  position){
    let ref = studentPosition + '/' + projPosition + '/' + position;   // use these 3 coord to locate fa in array
    this.setState({
        showDiv: "",
    });
    if (this.props.selectedfa) {
      helper.addFA(studentPosition, projPosition, position, studentKey, faKey, this.props.selectedfa._key, this.props);
      // increase visible rows by one 
      let index = this.state.value;
      let newvalue = this.props.falist[index]+1;
      helper.addRows(newvalue, index, this.props.dispatch)
    }
  }
  handleRemoveProject(studentPathPosition, projPosition){
    helper.removeProject(studentPathPosition, projPosition, this.props);
  }
  handleClose(studentPosition, projPosition, position){ 
      let ref = studentPosition + '/' + projPosition + '/ ' + position;
      this.setState({
        showDiv: "",
      });
  }
  handleSelectProject(studentIndex, projIndex){
    // console.log(studentIndex, projIndex)
    let data = studentIndex + '/' + projIndex;
    // let projectNode = ReactDOM.findDOMNode(this.refs[data]);
    // console.log( this.refs[data]);
   this.refs[data].scrollIntoView(true);
    // projectNode.scrollIntoView();  // experimental, alignToTop = true
  }

  handleViewDetails(focusArea) {
    this.props.selectFocusArea(focusArea);
    this.setState({ isFocusAreaDrawerOpen: true });
  }

  handleCloseFocusAreaDrawer() {
    this.setState({ isFocusAreaDrawerOpen: false });
  }

  handleViewRelatedProjects(pathName) {
    this.props.selectPath(pathName);
    this.setState({ isRelatedProjectsDrawerOpen: true });
  }

  handleCloseRelatedProjectsDrawer() {
    this.setState({ isRelatedProjectsDrawerOpen: false });
  }

  componentWillMount(){
    let maxVisibleFA = {};
    // set intial visible FA number, 20
    // only set if there is nothing in the list
    if ( Object.keys(this.props.falist).length == 0){
        for (var i = 0; i < this.props.paths.length; i++){
        maxVisibleFA[i]=20; 
      }
      helper.addInitialRows(maxVisibleFA, this.props.dispatch);
    }
  }
  componentDidMount(){
    this.setState({
      value: 0,
      showModal: false
    });
  }
  shouldComponentUpdate(nextProps) {
      if (this.nextProps === nextProps) {
        return false
      } else {
        return true;
      } 
  }
  renderFA(tabindex, component, studentPathPosition ) {
    // for each student there is a max path length that should be rendered for performance reasons
    // this is set in component.props.falist[tabindex] - this is used for mapping the fa results array
    // projects will not be counted in this number
    let maxVisibleFA = component.props.falist[tabindex];
    let faCounter = 0;  // this will be used to keep track of how many fa have been rendered so we dont go over maxVisibibleFA
    let projCounter = 0;
    return component.props.paths[tabindex].projectPath.map((project, index) => {
      let projPosition = projCounter;
      let idCounter = 0;
      maxVisibleFA -= faCounter; // reduce by the number in faCounter on each iteration, initially 0
      // slice allows only the portion of the array from 0 to our max counter maxVisibleFA to be rendered
      let faComponents = "";
      if (project.fa.length > 0){
        faComponents = project.fa.slice(0, maxVisibleFA).map((fa, index) => {
        faCounter++;  // increase for each fa iteration

          let faPosition =  idCounter;   

          idCounter++;
          <div>
          <Row className="fa-tab-view-rows" >
            <Col md={12}>
              <div style={styles.slide}>
                <Row >
                  <h3 className='fa-headings' style={styles.focusAreaHeader}>{fa.name}</h3>
                  {fa.relevance && this.relevance[fa.relevance] &&
                    <Chip style={styles.focusAreaRelevanceLabel}
                          backgroundColor={this.relevance[fa.relevance].color}
                    >
                      {this.relevance[fa.relevance].label}
                    </Chip>
                  }
                </Row>
                <hr />
              </div>
            </Col>
          </Row>
            <br /><hr />
          <Row className="fa-tab-view-rows">
            <Col md={12}>
                {changeButtons}                    
            </Col>
          </Row>
        </div>

        return (<div ref={index}> 
          {dragItem}
          {component.state.showDiv === studentPathPosition+'/'+ projPosition+'/'+faPosition ? (<div className="fa-wrapper path" id={studentPathPosition+'/'+faPosition} ref={studentPathPosition+'/'+faPosition}>
          <Row  >
            <Col xs={12} md={12} >
              <AutoCompleteFA />
            </Col>
            </Row>
            <Row>
            <Col xs={6} md={6} >
              {saveFAButton}
            </Col>
            <Col xs={6} md={6} >
              {closeDivButton}
            </Col>
          </Row>
          </div>) : ""}
          { ((index === maxVisibleFA-1) && (index < project.fa.length))? <div><Row><Col className="text-center" xs={12} md={12}><FlatButton containerElement='label' label="Show More FA"  onTouchTap={component.addRows}/></Col></Row></div> : ""}
        </div>)         
        }) 
      // }
      } else {
        faComponents = <div ><p key={component.props.paths[tabindex].studentsOnPath[0].name.toString() + "NoPaths"} className="no-paths-message"> No focus areas found for this project. Please requery using different filters.</p></div>
      }
      projCounter ++;
      return <div> 
              {maxVisibleFA > 0  ? 
               <Row className="text-center">
                <br />
                 <Col md={12}>
                   <div ref={studentPathPosition+'/'+projPosition}
                        id={studentPathPosition+'/'+projPosition}
                        style={{
                          position: 'relative',
                        }}
                   >
                     <h4>{project.name}</h4>
                     <FlatButton containerElement="label"
                                 label="View Related Projects"
                                 onTouchTap={() => {this.handleViewRelatedProjects(project.name)}}
                                 style={{
                                   position: 'absolute',
                                   top: '-8px',
                                   right: 0,
                                 }}
                     />
                   </div>
                   <hr />
                 </Col>
               </Row> : ""}
                {faComponents}
              </div>
    })
  }
  addRows(){
    let index =this.state.value;
    let newvalue = this.props.falist[index]+10;
    helper.addRows(newvalue, index, this.props.dispatch);
  }
  render() {
    // console.log("this state.value", this.state.value)
      const actions = [
      <FlatButton
          label="Close"
          onTouchTap={this.handleClose}
      />,
      <FlatButton
          label="Save"
          onTouchTap={this.handleAddFA}
      />
      ];
      var tabindex = this.state.value;
      var component = this;    
      let studentPathPosition = tabindex;
      if ((this.props.paths.length > 0)) {
        if ((this.props.paths[tabindex]) && (this.props.paths[tabindex].projectPath.length !== 0)) {    
        // there will be may focus areas returned for each pathway / group
        // var studentName= "... " + component.props.paths[tabindex].studentsOnPath.length + " students";
        // var studentNumber = component.props.paths[tabindex].studentsOnPath.length + " students";
        // rename projectComponent
        var faComponents = component.renderFA(tabindex, component, studentPathPosition);       
      } else {
        // if student has no paths -- add paths to a project - enhancement later??
        var faComponents = <div><p  key={tabindex + "NoProjects"} className="no-paths-message"> No Projects found. Please change search filters and try again.</p></div>
      }
      var resultsComponents  = component.props.paths.slice(this.state.showTabStart, this.state.showTabEnd).map(function(result, index) {
      let studentTabIndex = component.state.showTabStart + index;
      const studentCount = result.studentsOnPath.length
      const pluralizedLabel = studentCount > 1 ? " students" : " student"
      var numberOfStudents = studentCount + ' ' + pluralizedLabel;
      //map students --- this is id but when we have names we can replace
      var studentData = result.studentsOnPath.map(function(student, index) {
        const studentname = student.name;
             let studentnames = 
                    <Col className="text-center">
                      <div className="chip">                    
                           {studentname}
                      </div>
                    </Col>
                 
             return  <div className="student-chip-float"> {studentnames} </div>

      })
      return <Tab ref={tabindex} onActive={component.handleActive}  key={studentTabIndex} label={numberOfStudents} value={studentTabIndex} buttonStyle={{color: "#808080", whiteSpace: "normal"}}>            
                  <br />
                 <Row className="text-center">{studentData} </Row>
                 <br />
                 <Row className="results-layout">{faComponents} </Row>
                 
            </Tab>
      })             
    } 

      
    return <div key={ 0 + "Path Results"}>
    {((this.props.paths) && (this.props.paths.length > 0)) ? (<div className="text-center"> 
      <Row>
       <Col className="text-center" md={1} xs={1}>
        <IconButton iconStyle={styles.iconButton}   onTouchTap={() => component.handleMoveLeft()}  iconStyle={{height: 58}} style={{maxWidth: 100}} tooltip="Move Left"><LeftIcon /></IconButton>
      </Col>
      <Col className="text-center" md={10} xs={10}><Tabs inkBarStyle={{background: '#A35FE3'}}
        initialSelectedIndex={0}
        value={this.state.value}
        onChange={(value) => this.handleChange(value, 0)}
      >     
         {resultsComponents}
          {this.state.value}  
      </Tabs></Col>
      <Col className="text-center" md={1} xs={1}>
          <IconButton iconStyle={styles.iconButton}  onTouchTap={() => component.handleMoveRight()}  iconStyle={{height: 58}} style={{maxWidth: 100}} tooltip="Move Right"><RightIcon /></IconButton>
      </Col> 
      </Row>
    </div>) : <Tabs inkBarStyle={{background: '#A35FE3'}}
        initialSelectedIndex={0}
        value={this.state.value}
        onChange={(value) => this.handleChange(value, 0)}
      >     
          {resultsComponents}   
          {this.state.value}  
      </Tabs>}

      <FocusAreaDrawer open={this.state.isFocusAreaDrawerOpen}
                       focusArea={this.props.currentFocusArea}
                       isFocusAreaFetching={this.props.isFocusAreaInfoFetching}
                       onCloseClick={this.handleCloseFocusAreaDrawer}
                       paths={this.props.paths}
      />

      <RelatedProjectsDrawer open={this.state.isRelatedProjectsDrawerOpen}
                             relatedProjects={this.props.currentPathRelatedProjects}
                             isRelatedProjectsFetching={this.props.isRelatedProjectsFetching}
                             onCloseClick={this.handleCloseRelatedProjectsDrawer}
      />

    </div>
  
  }
}

const mapStateToProps = (state) => ({
  currentFocusArea: state.mainState.currentFocusArea,
  isFocusAreaInfoFetching: state.mainState.isFocusAreaInfoFetching,
  paths: state.mainState.paths,
  currentPathRelatedProjects: state.mainState.currentPathRelatedProjects,
  isRelatedProjectsFetching: state.mainState.isRelatedProjectsFetching,
});

const mapDispatchToProps = (dispatch) => {
  const boundActions = bindActionCreators({
    selectFocusArea,
    selectPath,
  }, dispatch);
  return {dispatch, ...boundActions};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PathViewer);


  