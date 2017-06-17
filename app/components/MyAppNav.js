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
            <Tabs  className="sticky-navbar-tabs">
                <Tab inkBarStyle={{background: '#A35FE3'}} label="Home" containerElement={<Link to="/"/>}/>
                <Tab  inkBarStyle={{background: '#A35FE3'}} label="Import Data" containerElement={<Link to="/csv"/>}/>
            </Tabs>
        </div>

);
 
export default MyAppNav;