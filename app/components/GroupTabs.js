import React from 'react';
import ReactDOM from "react-dom";
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';
import {Grid, Row, Col} from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {connect} from 'react-redux';
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
    // get FAlist for current user
    this.state = {
      value: 0,
      showModal: false,
      showDiv: "",
      showTabStart: 0,  // used to scroll thru tabs
      showTabEnd: 4,// used to scroll thru tabs
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
    console.log("this.state.showTabEnd === this.props.paths.length-1", this.state.showTabEnd, this.props.paths.length)
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
    console.log("showTabStart, delta",this.state.showTabStart, delta)
    console.log("showTabEnd, delta",this.state.showTabEnd, delta)
    this.setState({
      value: value,
      showTabStart: this.state.showTabStart+delta,
      showTabEnd: this.state.showTabEnd+delta

    });
  };
  handleAdd(studentPosition, projPosition, position){
    console.log("handleAdd",studentPosition, projPosition, position )
    let ref = studentPosition + '/' + projPosition + '/' + position;  // use these 3 coord to locate fa in array
    this.setState({
      showDiv: ref,  // ref should match coords
    });
  }
  handleDelete(studentPosition, studentKey, faKey, projPosition, position){
      console.log("handleDelet",studentPosition, projPosition, position )
    // must use keys to find position and delete
    helper.removeFA(studentPosition, projPosition, position, studentKey, faKey, this.props);   
  }
  handleActive = (tab) => {
    // console.log(tab)
    console.log("Active")
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
  // ondragstart(e){
    // var canvas = document.createElement('canvas');
    // var context = canvas.getContext('2d');

    // canvas.width = 100;
    // canvas.height = 200;

    // // context.fillStyle = '#333333';
    // // context.fisllRect(0, 0, canvas.width, canvas.height);

    // // context.fillStyle = '#999999';
    // // context.font = 'bold 13px Arial';
    // // context.fillText('DRAGGING...', 5, 15);

    // // context.drawImage(img,10,10);
    // console.log("e.target.id", e.target.id)
    // var srcDiv =  ReactDOM.findDOMNode(this.refs[e.target.id]);
    // // convert node to string
    // var tmpNode = document.createElement( "div" );
    // tmpNode.appendChild( srcDiv.cloneNode( true ) );
    // var str = tmpNode.innerHTML;
    // tmpNode = node = null; // prevent memory leaks in IE
//     // return str;
// console.log("srcDiv", srcDiv)

// var data = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
//            '<foreignObject width="100%" height="100%">' +
//             str  +
//            '</foreignObject>' +
//            '</svg>';
//     // console.log("data", data)
//     // var DOMURL = window.URL || window.webkitURL || window;

//     var img = new Image();
    // var svg = new Blob([data], {type: 'image/svg+html'});
    // var url = DOMURL.createObjectURL(svg);
    // console.log(url)
    // img.onload = function() {
    //   context.drawImage(img, 100, 100);
    //   // DOMURL.revokeObjectURL(url);
    // }
    // img.src = data;
    // img.width='100';
    // console.log("img", img)
  //   e.dataTransfer.setData('text', e.target.id ); 
  //   e.dataTransfer.effectAllowed = 'move';
  //   // e.dataTransfer.setDragImage(img, 0, 0);
  //   // document.body.append(canvas);
  //   e.target.classList.add('changeColor');

  //   return false;
  // }
  // ondragover(e) {  
  //   e.preventDefault && e.preventDefault();
  //   e.dataTransfer.dropEffect = 'move';
  //   // var dropNode = ReactDOM.findDOMNode(this.drop);
  //   // e.target.classList.add('over');
  //   // e.target.classList.add('dragelem');
  //   console.log("Drag over");
  //   return false;
  // }
  // ondragenter(e) {
  //   e.preventDefault && e.preventDefault();
  //   // e.target.classList.remove('hide');
  //   e.target.classList.add('dragelem');
  //    console.log("Drag enter");
  //   // e.target.classList.add('dragelem');
  //   // e.target.style.opacity = '0.4';
  //   // e.target.style.background = 'grey';
  //   // e.target.classList.add('over');
  // }
  // ondragleave(e) {
  //   e.preventDefault && e.preventDefault();
  //   e.target.classList.remove('dragelem');
  //   // e.target.classList.add('hide');
  //   // e.target.classList.remove('over');  // this / e.target is previous target element.
  //   // e.target.style.opacity = '1';
  //   // dropNode.style.color = 'black';
  //    return false;
  // }
  
  // ondragend(e) {  
  //   e.preventDefault && e.preventDefault();
  //   // e.target.classList.add('dragelem');
  //   // e.target.style.backgroundColor = "red";
  //   // dropHint.classList.add('hide');
  //   e.target.classList.remove('changeColor');
  //   // e.target.classList.remove('over');
  //   console.log("Drag end");
  //   return false;
  // }
  // ondrop(e) {
  //     e.preventDefault && e.preventDefault();
  //     e.target.classList.remove('dragelem');
  //     let data = e.dataTransfer.getData('text');
  //     var dragNode = ReactDOM.findDOMNode(this.refs[data]);
  //     helper.dragPath(e.target.id, dragNode.id, this.props);
  //     return false;
  // }
  renderFA(tabindex, component,studentPathPosition, studentName ) {
    // console.log("state.value", this.state.value)
    // for each student there is a max path length that should be rendered for performance reasons
    // this is set in component.props.falist[tabindex] - this is used for mapping the fa results array
    // projects will not be counted in this number
    let maxVisibleFA = component.props.falist[tabindex];
    let faCounter = 0;  // this will be used to keep track of how many fa have been rendered so we dont go over maxVisibibleFA
    let projCounter = 0;
      // not needed?? can use projCounter
    return component.props.paths[tabindex].projects.map(function(project, index) {
      let projPosition = projCounter;
      let idCounter = 0;
      maxVisibleFA -= faCounter; // reduce by the number in faCounter on each iteration, initially 0
      // slice allows only the portion of the array from 0 to our max counter maxVisibleFA to be rendered
      let faComponents = "";
      if (project.fa.length > 0){
        faComponents = project.fa.slice(0, maxVisibleFA).map(function(fa, index) {
        faCounter++;  // increase for each fa iteration
          if (fa.nextStd) {
              let count = 0;  // instead of using index which is unstable
              var nextStandards = fa.nextStd.map((standard, indexNextStd) => {
              count++;
              return   <Col key={component.props.paths[tabindex].student._key.toString()+'nextStd'+count.toString()} className="chip-float"><div className="chip">
                          {standard.toUpperCase()}
                        
                        </div>
                        </Col>
            });
          }
          if (fa.currentStd) {
            let count = 0;  // instead of using index which is unstable
            var currentStandards = fa.currentStd.map((standard, indexCurrentStandards) => {
                count++;
                return   <Col key={component.props.paths[tabindex].student._key.toString()+'currentStd'+count.toString()} className="chip-float"><div className="chip">
                    {standard.toUpperCase()}
                        </div>
                      </Col>
            });
          }
          let faPosition =  idCounter;   
          // let dropZone =  <div key={'dropzone' + index.toString()} className='text-center drop' ref={ref => component.drop = ref} onDrop={(e) => component.ondrop(e)}  onDragOver={(e) => component.ondragover(e)} onDragLeave={(e) => component.ondragleave(e)}  onDragEnter={(e) => component.ondragenter(e)} id={studentPathPosition+'|'+projPosition+'|'+faPosition}> . . . </div>
          let changeButtons = (<div><Col className="text-center" md={3} xs={3}>          
                      <FlatButton containerElement='label' label="Add"   onTouchTap={(e) => component.handleAdd(studentPathPosition, projPosition, faPosition)}/>  
                      </Col> 
                    <Col className="text-center" md={3} xs={3}>
                      <FlatButton containerElement='label' label="Remove"  onTouchTap={() => component.handleDelete(studentPathPosition, component.props.paths[tabindex].student._key, fa._key, projPosition, faPosition)} />                         
                    </Col>
                    <Col className="text-center" md={3} xs={3}>
                        <IconButton iconStyle={styles.iconButton} onTouchTap={() => component.handleMoveUp(studentPathPosition, projPosition, faPosition)}  iconStyle={{height: 48}} style={{maxWidth: 100}}  tooltip="Move Up"><UpIcon /></IconButton> 
                    </Col>
                    <Col className="text-center" md={3} xs={3}>
                      <IconButton iconStyle={styles.iconButton}  onTouchTap={() => component.handleMoveDown(studentPathPosition, projPosition, faPosition)}  iconStyle={{height: 48}} style={{maxWidth: 100}} tooltip="Move Down"><DownIcon /></IconButton>
                    </Col></div>);
          let saveFAButton = (<div><Col className="text-center" md={12} xs={6}>          
                      <FlatButton containerElement='label' label="Add FA"   disabled={component.props.selectedfa ? false: true}  onTouchTap={() => component.handleAddFA(studentPathPosition, component.props.paths[tabindex].student._key, fa._key, projPosition, faPosition)}/>
                      </Col> </div>);
          let closeDivButton = (<div><Col className="text-center" md={12} xs={6}>          
                      <FlatButton containerElement='label' label="Close"   onTouchTap={() => component.handleClose(studentPathPosition, projPosition, faPosition)}/>
                      </Col> </div>);
          idCounter++;
          let dragItem = <div ref={component.props.paths[tabindex].student._key.toString()+'|'+fa._key.toString()+'|'+studentPathPosition+'|'+projPosition+'|'+faPosition} id={component.props.paths[tabindex].student._key.toString()+'|'+fa._key.toString()+'|'+studentPathPosition+'|'+projPosition+'|'+faPosition} key={component.props.paths[tabindex].student._key.toString()+'|'+fa._key.toString()+'|'+studentPathPosition+'|'+projPosition+'|'+faPosition}  className="fa-wrapper path">
          {/* <Row> 
              <Col className="text-center" md={12}> 
                <div>. . .</div> 
              </Col> 
          </Row> */}
          <Row className="fa-tab-view-rows" >
              <Col md={12}><div style={styles.slide}>    
                  <Row >
                      <Col  md={3} xs={12}>
                        <h3  className='fa-headings'>Focus Area</h3>
                      </Col>
                      <Col  md={9} xs={12}>
                        <p  className='fa-headings-span'>{fa.name.toString()}</p>
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
                    { (index === fa.length-1) ? "": <div className="chip-float-text">Connected To</div>}
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
    //     // return this if there are no focus areas
    //     // faComponents = <div ><p key={component.props.paths[tabindex].student._key.toString() + "NoPaths"} className="no-paths-message"> No focus areas found for this project. Please add some or requery using different filters.</p>
    //     //         <div>
    //     //             <Row className="fa-tab-view-rows">
    //     //             <Col md={12}>
    //     //                 <Col className="text-center" md={6} xs={6}>          
    //     //                     <FlatButton containerElement='label' label="Add FA"  onTouchTap={(e) => component.handleAdd(studentPathPosition, projPosition, 0)}/>
    //     //                 </Col> 
    //     //                 <Col className="text-center" md={6} xs={6}>          
    //     //                     <FlatButton containerElement='label' label="Remove Project"  onTouchTap={(e) => component.handleRemoveProject(studentPathPosition, projPosition)}/>
    //     //                 </Col> 
    //     //             </Col>
    //     //           </Row>
    //     //            {component.state.showDiv === studentPathPosition+'/'+ projPosition +'/'+0 ? (<div className="fa-wrapper path" ref={studentPathPosition + '/'+ projPosition + '/'+ 0}>
    //     //             <Row>
    //     //                 <Col className="text-center"  xs={12} md={12} >
    //     //                     <AutoCompleteFA />
    //     //                 </Col>
    //     //                 <Row>
    //     //                   <Col  className="text-center"  xs={6} md={6} >                  
    //     //                       <FlatButton containerElement='label' label="Save FA"  disabled={component.props.selectedfa ? false: true} onTouchTap={() => component.handleAddFA(studentPathPosition, component.props.paths[tabindex].student._key, 0, projPosition, 0)}/>
    //     //                   </Col> 
    //     //                   <Col className="text-center" md={6} xs={6}>          
    //     //                     <FlatButton containerElement='label' label="Close"   onTouchTap={() => component.handleClose(studentPathPosition, projPosition, 0)}/>
    //     //                   </Col>
    //     //                 </Row>
    //     //             </Row>
    //     //       </div> ) : ""}
    //     //     </div>
    //     //   </div>
        faComponents = <div ><p key={component.props.paths[tabindex].student._key.toString() + "NoPaths"} className="no-paths-message"> No focus areas found for this project. Please requery using different filters.</p></div>
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
    console.log("this state.value", this.state.value)
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
      //******* need to rearrange this if loop at bit - it's v messy */
console.log(this.props.paths)
console.log("initial tabindex", tabindex)
      if ((this.props.paths.length > 0)) {
           
        // if ((this.props.paths[tabindex]) && (this.props.paths[tabindex].fa.length > 0)) {
        if ((this.props.paths[tabindex]) && (this.props.paths[tabindex].projects.length > 0)) {
          // there will be may Focus Areas returned for each pathway / group
          var studentName= component.props.paths[tabindex].student.first + " " + component.props.paths[tabindex].student.last;
          // rename projectComponent
          var faComponents = component.renderFA(tabindex, component, studentPathPosition, studentName );       
        } else {
          // if student has no paths -- add paths to a project - enhancement later??
          var faComponents = <div><p  key={component.props.paths[tabindex].student._key.toString() + "NoProjects"} className="no-paths-message"> No Projects found. Please change search filters and try again.</p></div>
        }

        // scroll into view not working....
        // var resultsComponents = component.props.paths.map(function(result, index) {
        //     let projectList = result.projects.map(function(project, projindex) {
        //        return <div key={'projecttab/'+result.student._key+'/'+project.name+'/'+project.sequence} >
        //             <FlatButton containerElement='label' label={project.name}  id={index+'/'+projindex}  onTouchTap={() => component.handleSelectProject(index, projindex)}/>
        //          </div>

        //     })
         
        // return <Tab  onActive={component.handleActive}  key={index} label={result.student.first + ' ' + result.student.last } value={index} buttonStyle={{color: "#808080"}}>
        //         <Row>
        //           <Col xs={2} md={2}>
        //             {projectList}
        //           </Col>
        //           <Col xs={10} md={10}>
        //             {faComponents}
        //           </Col>
        //         </Row>
        //      </Tab>
        // })  
        // var resultsComponents = component.props.paths.map(function(result, index) {
         var resultsComponents  = component.props.paths.slice(this.state.showTabStart, this.state.showTabEnd).map(function(result, index) {
        let studentTabIndex = component.state.showTabStart +  index;
        // console.log("  {studentTabIndex}", studentTabIndex)
        return <Tab  ref={component.selectedtab+index} onActive={component.handleActive}  key={studentTabIndex} label={result.student.first + ' ' + result.student.last } value={studentTabIndex} buttonStyle={{color: "#808080", whiteSpace: "normal"}}>            
                    {faComponents}
             </Tab>
        })             
      } 

      
    return <div key={ 0 + "Path Results"}>
    {((this.props.paths) && (this.props.paths.length > 0)) ? (<div className="text-center"> 
      <Row>
       <Col className="text-center" md={2} xs={2}>
        <IconButton iconStyle={styles.iconButton}   onTouchTap={() => component.handleMoveLeft()}  iconStyle={{height: 58}} style={{maxWidth: 100}} tooltip="Move Left"><LeftIcon /></IconButton>
      </Col>
      <Col className="text-center" md={8} xs={8}></Col>
      <Col className="text-center" md={2} xs={2}>
          <IconButton iconStyle={styles.iconButton}  onTouchTap={() => component.handleMoveRight()}  iconStyle={{height: 58}} style={{maxWidth: 100}} tooltip="Move Right"><RightIcon /></IconButton>
      </Col> 
      </Row>
    </div>) : ""}
    <Tabs inkBarStyle={{background: '#A35FE3'}}
        initialSelectedIndex={0}
        value={this.state.value}
        onChange={(value) => this.handleChange(value, 0)}
        tabType="fixed"
      >     
          {resultsComponents}   
          {this.state.value}  
      </Tabs>
    </div>
  
  }
}


export default connect()(GroupTabs);


  
