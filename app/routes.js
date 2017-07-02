import React from "react";
import ReactRouter from "react-router";
import IndexRoute from "react-router";
import PropsRoute from "react-router";
import Main from "./components/Main.js";
import PathBuilder from "./components/PathBuilder.js";
import DataImportCSV from "./components/DataImportCSV.js";
import {Router, Route, hashHistory, browserHistory} from "react-router";

var routes = (
    <Router history={browserHistory}>
        <Route component={Main} location={location.pathname} > 
            <Route path='/' component={PathBuilder} /> 
            <Route path='/csv' component={DataImportCSV} />
        </Route>
    </Router>
)

export default routes;

