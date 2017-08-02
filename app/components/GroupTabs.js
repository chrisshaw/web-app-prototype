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
import { Tabs, Tab } from 'material-ui-scrollable-tabs/Tabs';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import AutoCompleteFA from './AutoCompleteFA.js';

const styles = {
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
};


class GroupTabs extends React.Component {
  constructor(props) {
    super(props);
    this.handleActive = this.handleActive.bind(this);
    this.ondragstart = this.ondragstart.bind(this);
    this.ondragend = this.ondragend.bind(this);
    this.ondragover = this.ondragover.bind(this);
    this.ondragenter = this.ondragenter.bind(this);
    this.ondragleave = this.ondragleave.bind(this);
    this.ondrop = this.ondrop.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddFA = this.handleAddFA.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addRows = this.addRows.bind(this);
    // get FAlist for current user
    this.state = {
      value: 0,
      showModal: false,
      showDiv: "",
    };
  }  
  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
  handleAdd(studentPosition, projPosition, position){
    let ref = studentPosition + '/' + projPosition + '/' + position;  // use these 3 coord to locate fa in array
    this.setState({
      showDiv: ref,  // ref should match coords
    });
  }
  handleDelete(studentPosition, studentKey, faKey, projPosition, position){
    // must use keys to find position and delete
    helper.removeFA(studentPosition, projPosition, position, studentKey, faKey, this.props);   
  }
  handleActive = (tab) => {
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
  handleClose(studentPosition, projPosition, position){ 
      let ref = studentPosition + '/' + projPosition + '/ ' + position;
      this.setState({
        showDiv: "",
      });
  }
  componentWillMount(){
    let maxVisibleFA = {};
    // set intial visible FA number, 20
    // only set if there is nothing in the list
    console.log("Object.keys(this.props.falist).lengths", Object.keys(this.props.falist).length)
    if ( Object.keys(this.props.falist).length == 0){
        for (var i = 0; i < this.props.paths.length; i++){
        maxVisibleFA[i]=2; //// put back to 20!!
      }
      helper.addInitialRows(maxVisibleFA, this.props.dispatch);
    }
  }
  componentDidMount(){
    helper.getUserFA(this.props.username, this.props.dispatch);
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
  ondragstart(e){
    e.dataTransfer.setData('text', e.target.id ); 
    return false;
  }
  ondragover(e) {  
    e.preventDefault && e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    var dropNode = ReactDOM.findDOMNode(this.drop);
    // dropNode.classList.add('drop:hover');
       console.log("Drag over");
    return false;
  }
  ondragenter(e) {
    // this / e.target is the current hover target.
    // e.target.classList.add('over');
    console.log("Drag enter");
  }
  ondragleave(e) {
    // e.target.classList.remove('over');  // this / e.target is previous target element.
        console.log("Drag leave");
  }
  ondragend(e) {  
           console.log("Drag end");
    return false;
  }
  ondrop(e) {
      let data = e.dataTransfer.getData('text');
      console.log("data", data);
      var dragNode = ReactDOM.findDOMNode(this.refs[data]);
      console.log("dragNode.id", dragNode.id);
      console.log("e.target.id:", e.target.id);
      helper.movePath(e.target.id, dragNode.id, this.props);
      return false;
  }
  renderFA(tabindex, component,studentPathPosition, studentName ) {
    // for each student there is a max path length that should be rendered for performance reasons
    // this is set in component.props.falist[tabindex] - this is used for mapping the fa results array
    // projects will not be counted in this number
    let maxVisibleFA = component.props.falist[tabindex];
    let faCounter = 0;  // this will be used to keep track of how many fa have been rendered so we dont go over maxVisibibleFA
    let projCounter = 0;
    return component.props.paths[tabindex].projects.map(function(project, index) {
      let idCounter = 0;
      maxVisibleFA -= faCounter; // reduce by the number in faCounter on each iteration, initially 0
      console.log("maxVisibleFA, faCounter", maxVisibleFA, faCounter);
      // slice allows only the portion of the array from 0 to our max counter maxVisibleFA to be rendered
      let faComponents = "";
      // if (maxVisibleFA > 0){
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
        let projPosition = projCounter; 
        let dropZone =  <div key={'dropzone' + index.toString()} className='text-center drop' ref={ref => component.drop = ref} onDrop={(e) => component.ondrop(e)} onDragEnd={(e) => component.ondragend(e)} onDragOver={(e) => component.ondragover(e)} id={studentPathPosition+'/'+projPosition+'/'+faPosition}> . . . </div>
        let changeButtons = (<div><Col className="text-center" md={6} xs={6}>          
                    <FlatButton containerElement='label' label="Add"   onTouchTap={(e) => component.handleAdd(studentPathPosition, projPosition, faPosition)}/>
                      {studentPathPosition}  {projCounter}    {faPosition}        
                    </Col> 
                  <Col className="text-center" md={6} xs={6}>
                    <FlatButton containerElement='label' label="Remove"  onTouchTap={() => component.handleDelete(studentPathPosition, component.props.paths[tabindex].student._key, fa._key, projPosition, faPosition)} />                         
                  </Col></div>);
        let saveFAButton = (<div><Col className="text-center" md={12} xs={6}>          
                    <FlatButton containerElement='label' label="Add FA"   disabled={component.props.selectedfa ? false: true}  onTouchTap={() => component.handleAddFA(studentPathPosition, component.props.paths[tabindex].student._key, fa._key, projPosition, faPosition)}/>
                    </Col> </div>);
        let closeDivButton = (<div><Col className="text-center" md={12} xs={6}>          
                    <FlatButton containerElement='label' label="Close"   onTouchTap={() => component.handleClose(studentPathPosition, projPosition, faPosition)}/>
                    </Col> </div>);
        idCounter++;
        /// this return is to facomponent - it displays all the data for one fa within a path
        return (<div ref={index}> {dropZone}
          <div ref={component.props.paths[tabindex].student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()+'/'+studentPathPosition+'/'+projPosition+'/'+faPosition} id={component.props.paths[tabindex].student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()+'/'+studentPathPosition+'/'+projPosition+'/'+faPosition} key={component.props.paths[tabindex].student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()+'/'+studentPathPosition+'/'+projPosition+'/'+faPosition}  className="fa-wrapper path" draggable="true" onDragStart={(e) => component.ondragstart(e)}  onDragLeave={(e) => component.ondragleave(e)}  onDragEnter={(e) => component.ondragenter(e)}>
          <Row> <Col className="text-center" md={12}> . . . </Col> </Row>
          <Row className="fa-tab-view-rows" >
              <Col md={12}><div style={styles.slide}>    
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
          {component.state.showDiv == studentPathPosition+'/'+ projPosition+'/'+faPosition ? (<div className="fa-wrapper path" id={studentPathPosition+'/'+faPosition} ref={studentPathPosition+'/'+faPosition}>
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

      projCounter ++;
      return <div> 
              {maxVisibleFA > 0 ? 
              project.name : ""}
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
      // console.log("maxVisibleFA", this.state.maxVisibleFA)
      var component = this;    
      let studentPathPosition = tabindex;
           console.log("component.props", component.props)
       //******* need to rearrange this if loop at bit - it's v messy */
      if ((this.props.paths.length > 0)) {
        // if ((this.props.paths[tabindex]) && (this.props.paths[tabindex].fa.length > 0)) {
            if ((this.props.paths[tabindex]) && (this.props.paths[tabindex].projects.length > 0)) {

              // there will be may Focus Areas returned for each pathway / group
              var studentName= component.props.paths[tabindex].student.first + " " + component.props.paths[tabindex].student.last;
              // var idCounter = 0;

              // rename projectComponent
              var faComponents = component.renderFA(tabindex, component, studentPathPosition, studentName );
              
            } else {
              let faPosition = 0;
              var faComponents = <div><p  key={component.props.paths[tabindex].student._key.toString() + "NoPaths"} className="no-paths-message"> No path found. Please change search filters and try again.</p>
                <div>
                    <Row className="fa-tab-view-rows">
                    <Col md={12}>
                        <Col className="text-center" md={12} xs={12}>          
                            <FlatButton containerElement='label' label="Add FA"   onTouchTap={(e) => component.handleAdd(studentPathPosition, 0)}/>
                        </Col> 
                    </Col>
                  </Row>
                   {component.state.showDiv == studentPathPosition+'/'+ 0 +'/'+0 ? (<div className="fa-wrapper path" ref={studentPathPosition + '/'+ 0 + '/'+0}>
                    {studentPathPosition+'/'+0}
                    <Row>
                        <Col className="text-center"  xs={12} md={12} >
                            <AutoCompleteFA />
                        </Col>
                        <Col  className="text-center"  xs={12} md={12} >                  
                            <FlatButton containerElement='label' label="Save FA"  disabled={component.props.selectedfa ? false: true} onTouchTap={() => component.handleAddFA(studentPathPosition, component.props.paths[tabindex].student._key, 0, 0)}/>
                        </Col>
                    </Row>
              </div> ) : ""}
            </div>
          </div>
        }

        var resultsComponents = component.props.paths.map(function(result, index) {
        return <Tab  onActive={component.handleActive}  key={index} label={component.props.paths[index].student.first + ' ' + component.props.paths[index].student.last } value={index} buttonStyle={{color: "#808080"}}>
                  {faComponents}
                  </Tab>
        })  
           
      }

      
    return <div key={ 0 + "Path Results"}>
    {((this.props.paths) && (this.props.paths.length > 0)) ? (<div className="text-center"> <h5><em>Scroll or Use Arrow Keys to View All Students</em> </h5></div>) : ""}
    <Tabs inkBarStyle={{background: '#A35FE3'}}
        initialSelectedIndex={0}
        value={this.state.value}
        tabType="scrollable"
      >     
          {resultsComponents}      
      </Tabs>
    </div>
  
  }
}


export default connect()(GroupTabs);


  
