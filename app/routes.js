import React from "react";
import ReactRouter from "react-router";
import IndexRoute from "react-router";
import Main from "./components/Main.js";
import QueryBuilder from "./components/QueryBuilder.js";
import FocusAreaDetail from "./components/FocusAreaDetail.js";
import {Router, Route, hashHistory, browserHistory} from "react-router";

var routes = (
    <Router history={browserHistory}>
        <Route component={Main} > 
            <Route path='/' component={QueryBuilder} /> 
            <Route path='/detail' component={FocusAreaDetail} />
        </Route>
    </Router>
)

export default routes;