import React from 'react';
import ReactDOM from "react-dom";
// import {Tabs, Tab} from 'material-ui/Tabs';
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
import { Tabs, Tab } from 'material-ui-scrollable-tabs/Tabs';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

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
    this.ondragstart = this.ondragstart.bind(this);
    this.ondragend = this.ondragend.bind(this);
    this.ondragover = this.ondragover.bind(this);
    this.ondragenter = this.ondragenter.bind(this);
    this.ondragleave = this.ondragleave.bind(this);
    this.ondrop = this.ondrop.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      value: 0,
    };
  }
  handleAdd(position, studentKey, faKey){
    console.log("addd", position, studentKey, faKey)
  }
  handleDelete(position, studentKey, faKey){
    console.log("remove", position, studentKey, faKey)
  }
  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
  componentDidMount(){
   console.log("paths in group mount", this.props.paths)
    this.setState({
      value: 0,
    });
  }
  componentWillReceiveProps(nextProps){
      
          console.log("nextProps", nextProps)
           console.log("thisprops", this.props)
  }
  // shouldComponentUpdate(nextProps) {
  //     // if (this.props.path !== nextProps.path) return true;
  //     // if (this.props.path === nextProps.path) return false;

  //     // const differentDone = this.props.done !== nextProps.done
  // }
    ondragstart(e){
      console.log("dragstart src", e.target.id);
      // e.target.className = 'drag';
      e.dataTransfer.setData('text', e.target.id ); 
      // e.target.style.opacity = "0.8";
      // e.target.style.background = "#E5E5E5";
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
      e.target.classList.add('over');
    }

    ondragleave(e) {
      e.target.classList.remove('over');  // this / e.target is previous target element.
    }
    ondragend(e) {  
      return false;
    }
    ondrop(e) {
//           e.preventDefault();
          // var data = e.dataTransfer.getData();
          console.log("drop:", e.target)
          let data = e.dataTransfer.getData('text');
          // e.target.style.background = "#FFFFFF";
          // let doc = new DOMParser().parseFromString(data, 'text');
          console.log(data);
          var dragNode = ReactDOM.findDOMNode(this.refs[data]);
          e.target.appendChild(dragNode);   
          // console.log("this",this.refs); // student._key, fa.key and fa._id stored here 
          // var newPathArr = Object.keys(this.refs);
          // console.log(newPathArr);

        
          // dragNode.style.opacity = "1.0";
          // dragNode.style.background = "#FFFFFF";
          console.log
          helper.savePath(e.target.id, dragNode.id, this.props.paths, this.props.dispatch);
          // console.log(ReactDOM.findDOMNode(this.path) )// Returns the elements


          return false;
    }
  render() {
      //// GET TABS from results
      // display any paths   
      // paths is an array of objects
      // each array item is an object with a group, grade, faid, and an array of paths in "results" field in order
      // this array of paths is what will be displayed in each group tab
      // they just need to be matched  
      // console.log("in render")
      if (this.props.paths)  {
        //  console.log("in render")
        // there will be one results component returned for each pathway / group.
        // var tabindex = this.state.value;
        let pathResults = this.props.paths.length;
        // only one path returned
        
        if ((pathResults) && (this.props.paths.length > 0)) {
          console.log("in this.props.paths", this.props.paths)
          var component = this; 
        
          var resultsComponents = this.props.paths.map(function(student, index) {
            
            // there will be may Focus Areas returned for each pathway / group
            var studentName= student.student.first + " " + student.student.last;
            if  (student.fa.length > 0) {
              var idCounter = 0;
              var faComponents = student.fa.map(function(fa, index) {
                let count = 0;  // instead of using index which is unstable
                if (fa.nextStd) {
                    var nextStandards = fa.nextStd.map((standard, index) => {
                    count++;
                    return   <Col key={student.student._key.toString()+'nextStd'+count.toString()} className="chip-float"><div className="chip">
                                {standard.toUpperCase()}
                              </div>
                              </Col>
                  });
                }

                if (fa.currentStd) {
                  let count = 0;  // instead of using index which is unstable
                  var currentStandards = fa.currentStd.map((standard, index) => {
                      count++;
                      return   <Col key={student.student._key.toString()+'currentStd'+count.toString()} className="chip-float"><div className="chip">
                          {standard.toUpperCase()}
                              </div>
                            </Col>
                  });
                }

                let dropZone =  <div  className='text-center drop' ref={ref => component.drop = ref} onDrop={(e) => component.ondrop(e)} onDragEnd={(e) => component.ondragend(e)} onDragOver={(e) => component.ondragover(e)} id={idCounter}> . . . </div>
              //  console.log("dropZone", dropZone)
                idCounter++;
                /// this return is to facomponent - it displays all the data for one fa within a path
                return (  <div> {dropZone}
                  <div ref={student.student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()} id={student.student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()} key={student.student._key.toString()+'/'+fa._key.toString()+'/'+fa.name.toString()}  className="fa-wrapper path" draggable="true" onDragStart={(e) => component.ondragstart(e)}  onDragLeave={(e) => component.ondragleave(e)}  onDragEnter={(e) => component.ondragenter(e)}>
                  <Row> <Col className="text-center" md={12}> . . . </Col> </Row>
                  <Row className="fa-tab-view-rows" >
                      <Col md={10}><div style={styles.slide}>    
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
                      <Col md={2}>
                          <Col className="text-center" md={12} xs={6}>          
                            <FlatButton containerElement='label' label="Add"  onTouchTap={() => component.handleAdd(idCounter-1, student.student._key, fa._key)}/>
                          </Col> 
                          <Col className="text-center" md={12} xs={6}>
                            <FlatButton containerElement='label' label="Remove"  onTouchTap={() => component.handleDelete(idCounter-1, student.student._key, fa._key)} />                         
                          </Col>
                      </Col>
                    </Row>
                  </div>
                </div>)         
              })

            } else {
              var  faComponents = <p className="no-paths-message"> No path found. Please change search filters and try again.</p>
            }


            return  <Tab key={student.student._key.toString()} ref={ref => component.path = ref}  label={studentName} value={index}  buttonStyle={{color: "#808080"}}>
            {faComponents} 
          </Tab>  
          })
       
        }  else {
           var resultsComponents = <Tab label="No Paths" value={this.state.value}  buttonStyle={{color: "#808080"}}>
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
        value={this.state.value}
        onChange={this.handleChange}
        tabType="scrollable"
      >     
          {resultsComponents}
          {console.log("value", this.state.value)}
        
      </Tabs>
    </div>
  
  }
}

export default connect()(GroupTabs);






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
  
