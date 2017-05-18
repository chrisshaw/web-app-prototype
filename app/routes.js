import React from "react";
import ReactRouter from "react-router";
import IndexRoute from "react-router";
import Main from "./components/Main.js"
import {Router, Route, hashHistory, browserHistory} from "react-router";

var routes = (
    <Router history={browserHistory}>
        <Route path="/" component={Main} />     
    </Router>
)

export default routes;