import React from 'react';
import ReactDOM from "react-dom";
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';
import {Grid, Row, Col} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import helper from '../helper';
import Dialog from 'material-ui/Dialog';
// need to move to next versoin of material ui but until then will use import { Tabs, Tab } from 'material-ui-scrollable-tabs/Tabs';
// import { Tabs, Tab } from 'material-ui-scrollable-tabs/Tabs';
import {Tabs, Tab} from 'material-ui/Tabs';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AutoCompleteFA from './AutoCompleteFA.js';
import UpIcon from './UpIcon.js';
import DownIcon from './DownIcon.js';
import RightIcon from './RightIcon.js';
import LeftIcon from './LeftIcon.js';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import FocusAreaDrawer from './FocusAreaDrawer';

import { selectFocusArea } from '../actions/focusAreas';

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
}

class GroupTabs extends React.Component {
  constructor(props) {
    super(props);
    this.handleActive = this.handleActive.bind(this);
    // this.ondragstart = this.ondragstart.bind(this);
    // this.ondragend = this.ondragend.bind(this);
    // this.ondragover = this.ondragover.bind(this);
    // this.ondragenter = this.ondragenter.bind(this);
    // this.ondragleave = this.ondragleave.bind(this);
    // this.ondrop = this.ondrop.bind(this);
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
    // get FAlist for current user
    this.state = {
      value: 0,
      showModal: false,
      showDiv: "",
      showTabStart: 0,  // used to scroll thru tabs
      showTabEnd: 4,// used to scroll thru tabs
      isDrawerOpen: false,
      currentFocusArea: {},
    };
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
    this.setState({ isDrawerOpen: true });
  }

  handleCloseFocusAreaDrawer() {
    this.setState({ isDrawerOpen: false });
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
          let changeButtons = (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <FlatButton containerElement="label" label="View Details" onTouchTap={() => {this.handleViewDetails(fa)}}/>
              <FlatButton containerElement='label' label="Add"   onTouchTap={(e) => component.handleAdd(studentPathPosition, projPosition, faPosition)}/>
              <FlatButton containerElement='label' label="Remove"  onTouchTap={() => component.handleDelete(studentPathPosition, component.props.paths[tabindex].studentsOnPath[0].name, fa._key, projPosition, faPosition)} />
              <IconButton iconStyle={styles.iconButton} onTouchTap={() => component.handleMoveUp(studentPathPosition, projPosition, faPosition)}  iconStyle={{height: 48}} style={{maxWidth: 100}}  tooltip="Move Up"><UpIcon /></IconButton>
              <IconButton iconStyle={styles.iconButton}  onTouchTap={() => component.handleMoveDown(studentPathPosition, projPosition, faPosition)}  iconStyle={{height: 48}} style={{maxWidth: 100}} tooltip="Move Down"><DownIcon /></IconButton>
            </div>
          );
          let saveFAButton = (<div><Col className="text-center" md={12} xs={6}>          
                      <FlatButton containerElement='label' label="Add FA"   disabled={component.props.selectedfa ? false: true}  onTouchTap={() => component.handleAddFA(studentPathPosition, component.props.paths[tabindex].studentsOnPath[0].name, fa._key, projPosition, faPosition)}/>
                      </Col> </div>);
          let closeDivButton = (<div><Col className="text-center" md={12} xs={6}>          
                      <FlatButton containerElement='label' label="Close"   onTouchTap={() => component.handleClose(studentPathPosition, projPosition, faPosition)}/>
                      </Col> </div>);
          idCounter++;
          
          let dragItem = <div
                            ref={[component.props.paths[tabindex].studentsOnPath[0].name, fa._id, studentPathPosition, projPosition, faPosition].join('|')}
                            id={[component.props.paths[tabindex].studentsOnPath[0].name, fa._id, studentPathPosition, projPosition, faPosition].join('|')}
                            key={[component.props.paths[tabindex].studentsOnPath[0].name, fa._id, studentPathPosition, projPosition, faPosition].join('|')}
                            className="fa-wrapper path"
                            >

          <Row className="fa-tab-view-rows" >
              <Col md={12}><div style={styles.slide}>    
                  <Row >
                      <h3  className='fa-headings'>{fa.name}</h3>
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
               <Col md={12}><div ref={studentPathPosition+'/'+projPosition}  id={studentPathPosition+'/'+projPosition}><h4>{project.name} </h4></div><hr /></Col>     
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

      <FocusAreaDrawer open={this.state.isDrawerOpen}
                       focusArea={this.props.currentFocusArea}
                       isFocusAreaFetching={this.props.isFocusAreaInfoFetching}
                       onCloseClick={this.handleCloseFocusAreaDrawer}
      />

    </div>
  
  }
}

const mapStateToProps = (state) => ({
  currentFocusArea: state.mainState.currentFocusArea,
  isFocusAreaInfoFetching: state.mainState.isFocusAreaInfoFetching,
});

const mapDispatchToProps = (dispatch) => {
  const bindedActions = bindActionCreators({
    selectFocusArea,
  }, dispatch);
  return {dispatch, ...bindedActions};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupTabs);


  
