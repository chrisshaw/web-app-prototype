
// Include the Main React Dependencies
var React = require("react");
var ReactDOM = require("react-dom");
import routes from "./routes.js";
import configureStore from './store';
import {Provider} from 'react-redux'

import {syncHistoryWithStore} from 'react-router-redux'
import {Router, browserHistory} from 'react-router'

// // This file should not need to be changed
ReactDOM.render(<Provider store={configureStore()}>
{routes}
</Provider>, document.getElementById("app"));


