import React from "react";
import ReactRouter from "react-router";
import IndexRoute from "react-router";
import Main from "./components/Main.js";
import PathBuilder from "./components/PathBuilder.js";
import HomePage from "./components/HomePage.js";
import DataImportCSV from "./components/DataImportCSV.js";
import {Router, Route, hashHistory, browserHistory} from "react-router";

var routes = (
    <Router history={browserHistory}>
        <Route component={Main} > 
            <Route path='/' component={HomePage} />
            <Route path='/pathbuilder' component={PathBuilder} /> 
            <Route path='/csv' component={DataImportCSV} />
        </Route>
    </Router>
)

export default routes;