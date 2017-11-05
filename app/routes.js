import React from "react";
import ReactRouter from "react-router";
// import IndexRoute from "react-router";
// import PropsRoute from "react-router";
import Main from "./components/Main/Main";
import SignUpTab from "./components/SignUpTab";
import Login from "./components/Login/Login";
import Forbidden from "./components/Forbidden";
import Password from "./components/Password";
import validatePerms  from "./components/ValidatePerms";
import PathBuilder from "./components/PathBuilder";
import AdminPanel from "./components/AdminPanel";
import {Router, Route, hashHistory, browserHistory, IndexRoute} from "react-router";
// import ValidatePermissions from "./components/ValidatePermissions.js";

// i have added an auth prop to each route to indicate what perm item is needed to view
// this currently matches the route name but does not need to as long as it matches a perm in the db auth_perms table
var routes = (
    <Router history={browserHistory}>
        <Route path='/' component={Main} > 
            <IndexRoute auth='buildPath' component={validatePerms(PathBuilder)}/>
            <Route path='/create-account' auth='createAccounts' component={validatePerms(SignUpTab)} />
            <Route path='/build-path' auth='buildPath' component={validatePerms(PathBuilder)} /> 
            <Route path='/setup'  auth='manageStudents' component={validatePerms(AdminPanel)} />
            <Route path='/password' component={Password} />
            <Route path='/forbidden' component={Forbidden} />
            <Route path='/login' component={Login} />
        </Route>
    </Router>
)

export default routes;