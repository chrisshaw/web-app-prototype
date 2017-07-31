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
      // maxVisibleFA: []
    };
  }
    
  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
  handleAdd(studentPosition, position){
    let ref = studentPosition + '/' + position;
    this.setState({
    showDiv: ref,
    });
  }
  handleDelete(studentPosition, studentKey, faKey, position){
    // must use keys to find position and delete
    //submite changes
    helper.removeFA(studentPosition, position, studentKey, faKey, this.props);
    
  }
  handleActive = (tab) => {
      this.setState({
      value: tab.props.value,
      });
  };
  handleAddFA(studentPosition, studentKey, faKey, position){
    let ref = studentPosition + '/' + position; 
    this.setState({
      showDiv: "",
      });
    if (this.props.selectedfa) {
      helper.addFA(studentPosition, position, studentKey, faKey, this.props.selectedfa._key, this.props);
      // increase visible rows by one
      let index = this.state.value;
      let newvalue = this.props.falist[index]+1;
      helper.addRows(newvalue, index, this.props.dispatch)
    }
  }
  handleClose(studentPosition, position){ 
      let ref = studentPosition + '/' + position;
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
        maxVisibleFA[i]=20;
      }
      helper.addInitialRows(maxVisibleFA, this.props.dispatch);
    }

  }
  componentDidMount(){
    helper.getUserFA(this.props.username, this.props.dispatch);
    this.setState({
      value: 0,
      showModal: false,
      // maxVisibleFA: maxVisibleFA,
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
    // e.target.className  = 'drop';
    var dropNode = ReactDOM.findDOMNode(this.drop);
    dropNode.classList.add('drop:hover');
    return false;
  }
  ondragenter(e) {
    // this / e.target is the current hover target.
    // e.target.classList.add('over');
  }

  ondragleave(e) {
    // e.target.classList.remove('over');  // this / e.target is previous target element.
  }
  ondragend(e) {  
    return false;
  }
  ondrop(e) {
      let data = e.dataTransfer.getData('text');
      var dragNode = ReactDOM.findDOMNode(this.refs[data]);
      helper.movePath(e.target.id, dragNode.id, this.props.paths, this.props.dispatch);
      return false;
  }
  renderFA(maxVisibleFA,tabindex, component,studentPathPosition, studentName, idCounter ) {

    let faComponents = "";
    return faComponents = component.props.paths[tabindex].fa.slice(0, maxVisibleFA).map(function(fa, index) {
      let count = 0;  // instead of using index which is unstable
      if (fa.nextStd) {
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
      let dropZone =  <div key={'dropzone' + index.toString()} className='text-center drop' ref={ref => component.drop = ref} onDrop={(e) => component.ondrop(e)} onDragEnd={(e) => component.ondragend(e)} onDragOver={(e) => component.ondragover(e)} id={idCounter}> . . . </div>
      let faPosition =  idCounter; 
      let changeButtons = (<div><Col className="text-center" md={6} xs={6}>          
                  <FlatButton containerElement='label' label="Add"   onTouchTap={(e) => component.handleAdd(studentPathPosition, faPosition)}/>
                  </Col> 
                <Col className="text-center" md={6} xs={6}>
                  <FlatButton containerElement='label' label="Remove"  onTouchTap={() => component.handleDelete(studentPathPosition, component.props.paths[tabindex].student._key, fa._key, faPosition)} />                         
                </Col></div>);
      let saveFAButton = (<div><Col className="text-center" md={12} xs={6}>          
                  <FlatButton containerElement='label' label="Add FA"   disabled={component.props.selectedfa ? false: true}  onTouchTap={() => component.handleAddFA(studentPathPosition, component.props.paths[tabindex].student._key, fa._key, faPosition)}/>
                  </Col> </div>);
      let closeDivButton = (<div><Col className="text-center" md={12} xs={6}>          
                  <FlatButton containerElement='label' label="Close"   onTouchTap={() => component.handleClose(studentPathPosition, faPosition)}/>
                  </Col> </div>);
      idCounter++;
      /// this return is to facomponent - it displays all the data for one fa within a path
      return (<div ref={index}> {dropZone}
        <div ref={component.props.paths[tabindex].student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()} id={component.props.paths[tabindex].student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()} key={component.props.paths[tabindex].student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()}  className="fa-wrapper path" draggable="true" onDragStart={(e) => component.ondragstart(e)}  onDragLeave={(e) => component.ondragleave(e)}  onDragEnter={(e) => component.ondragenter(e)}>
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
                      {console.log(fa.nextFA)}
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
        {component.state.showDiv == studentPathPosition+'/'+faPosition ? (<div className="fa-wrapper path" id={studentPathPosition+'/'+faPosition} ref={studentPathPosition+'/'+faPosition}>
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
        { ((index === maxVisibleFA-1) && (index < component.props.paths[tabindex].fa.length))? <div><Row><Col className="text-center" xs={12} md={12}><FlatButton containerElement='label' label="Show More FA"  onTouchTap={component.addRows}/></Col></Row></div> : ""}
      </div>)         
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
      if ((this.props.paths.length > 0)) {
        if ((this.props.paths[tabindex]) && (this.props.paths[tabindex].fa.length > 0)) {
              // there will be may Focus Areas returned for each pathway / group
              var studentName= component.props.paths[tabindex].student.first + " " + component.props.paths[tabindex].student.last;
              var idCounter = 0;
              var faComponents = component.renderFA(component.props.falist[tabindex], tabindex, component,studentPathPosition,studentName, idCounter );
              
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
                   {component.state.showDiv == studentPathPosition+'/'+faPosition ? (<div className="fa-wrapper path" ref={studentPathPosition+'/'+faPosition}>
                    {studentPathPosition+'/'+faPosition}
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


  
