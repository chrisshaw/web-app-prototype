import React from "react";
import ReactRouter from "react-router";
// import IndexRoute from "react-router";
// import PropsRoute from "react-router";
import Main from "./components/Main.js";
import SignUpTab from "./components/SignUpTab";
import LoginTab from "./components/LoginTab";
import Forbidden from "./components/Forbidden";
import Password from "./components/Password";
import validatePerms  from "./components/validatePerms";
import PathBuilder from "./components/PathBuilder.js";
import DataImportStudentCSV from "./components/DataImportStudentCSV.js";
import {Router, Route, hashHistory, browserHistory, IndexRoute} from "react-router";
// import ValidatePermissions from "./components/ValidatePermissions.js";

// i have added an auth prop to each route to indicate what perm item is needed to view
// this currently matches the route name but does not need to as long as it matches a perm in the db auth_perms table
var routes = (
    <Router history={browserHistory}>
        <Route path='/' component={Main} > 
            <IndexRoute auth='buildpath' component={validatePerms(PathBuilder)}/>
            <Route path='/manageusers' auth='manageusers' component={validatePerms(SignUpTab)} />
            <Route path='/buildpath' auth='buildpath' component={validatePerms(PathBuilder)} /> 
            <Route path='/uploadstudents'  auth='uploadstudents' component={validatePerms(DataImportStudentCSV)} />
             <Route path='/password' component={Password} />
            <Route path='/forbidden' component={Forbidden} />
            <Route path='/login' component={LoginTab} />
        </Route>
    </Router>
)

export default routes;

