import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
// import FlexibleSpace from 'material-ui/FlexibleSpace';

import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Tabs, {Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';

const MyAppNav = () => (
        <div >
            <AppBar className="sticky-navbar"
            title={<div className="text-center"><span><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
            showMenuIconButton={false}
            />
            <Tabs inkBarStyle={{background: '#A35FE3'}} className="sticky-navbar-tabs">
                <Tab  label="Home" containerElement={<Link to="/"/>}/>
                <Tab  label="Import Data" containerElement={<Link to="/csv"/>}/>
            </Tabs>
        </div>

);
 
export default MyAppNav;