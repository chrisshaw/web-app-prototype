import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, {Tab} from 'material-ui/Tabs';


const styles = {
  title : {
    height: 50,
    margin: 0,
    lineHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  }
};


class PathAppNav extends Component {
    constructor(props){
        super(props);
    }
    render(){
       return (<div>
                  <AppBar className="sticky-navbar" 
                    title={ <div><span><img src="./public/assets/img/sidekick.png" className="drawer-logo" alt="Sidekick" /></span></div>}
                    titleStyle={styles.title}
                    iconStyleLeft={{display: 'none'}}
                    iconStyleRight={{display: 'none'}}
                    />            
                </div>)
    }
};

export default PathAppNav; 
