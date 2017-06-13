import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
// import FlexibleSpace from 'material-ui/FlexibleSpace';

import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Tabs, {Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';


// const styles = {
//   title: {
//     cursor: 'pointer',
//   },
//   font: {
//       color: 'white',
//   }
// };

function handleTouchTap() {
  alert('onTouchTap triggered on the title component');
}

// customization of theme
// const navBarTheme = getMuiTheme({
//   palette: {
//     textColor: '#FFFFFF',
//     primary2Color:  "#2FBB2F",
//   },
//   zIndex: 1000,
//   appBar: {
//     top: 0,
//     height: 180, 
//     textColor: '#FFFFFF',
//     color: "#2FBB2F",
//   },
//   tabs: {
//     color: "#2FBB2F",
//     textColor: '#FFFFFF',
//   },
//   tab: {
//     color: "#2FBB2F",
//     textColor: '#FFFFFF',
//   }

// });

// const navBarLowerTheme = {
//   appBar: {
//     height: 70, 
//   }
// };

// const navBarUpperTheme = {
//   appBar: {
//     height: 180, 
//   },   
//   img: {
//     height: 180, 
//   }
// };
const MyAppNav = () => (
        <div >
            <AppBar className="sticky-navbar"
            title={<div className="text-center"><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
            onTitleTouchTap={handleTouchTap}
            showMenuIconButton={false}
            />
            <Tabs className="sticky-navbar-tabs">
                <Tab label="Home" containerElement={<Link to="/"/>}/>
                <Tab label="Import Data" containerElement={<Link to="/csv"/>}/>
            </Tabs>
        </div>

);
// const MyAppNav = () => (
//             <AppBar>
//                 <FlexibleSpace>
//                     <div className="text-center"><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>
//                 </FlexibleSpace>
//                 <Tabs>
//                     <Tab label="Item One" containerElement={<Link to="/"/>}/>
//                     <Tab label="Item Two" containerElement={<Link to="/"/>}/>
//                     <Tab label="Item Three" containerElement={<Link to="/"/>}/>
//                 </Tabs>
//             </AppBar>

// );

// <AppBar style={navBarLowerTheme.appBar}
//         iconElementRight={<div>
//             <FlatButton style={navBarLowerTheme.flatButton} value={0} label="Home" containerElement={<Link to="/"/>} />
//             <FlatButton value={1} label="Login" containerElement={<Link to="/"/>}/>
//             <FlatButton value={2} label="Something" containerElement={<Link to="/"/>} />
//         </div> }
//         showMenuIconButton={false}
//         />
 
export default MyAppNav;