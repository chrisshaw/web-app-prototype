
// Include the Main React Dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import routes from "./routes.js";
import configureStore from './store';
import {Provider} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {syncHistoryWithStore} from 'react-router-redux';
import {Router, browserHistory} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';


// // This file should not need to be changed
ReactDOM.render(<MuiThemeProvider><Provider store={configureStore()}>
{routes}
</Provider></MuiThemeProvider>, document.getElementById("app"));


