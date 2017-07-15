import React from "react";
import ReactRouter from "react-router";
// import IndexRoute from "react-router";
// import PropsRoute from "react-router";
import Main from "./components/Main.js";
import SignUpTab from "./components/SignUpTab";
import LoginTab from "./components/LoginTab";
import validatePerms  from "./components/validatePerms";
import PathBuilder from "./components/PathBuilder.js";
import DataImportStudentCSV from "./components/DataImportStudentCSV.js";
import {Router, Route, hashHistory, browserHistory, IndexRoute} from "react-router";
// import ValidatePermissions from "./components/ValidatePermissions.js";


var routes = (
    <Router history={browserHistory}>
        <Route path='/' component={Main} > 
            <IndexRoute component={validatePerms(PathBuilder)}/>
            <Route path='/signup' component={validatePerms(SignUpTab)} />
            <Route path='/path' component={validatePerms(PathBuilder)} /> 
            <Route path='/csv' component={validatePerms(DataImportStudentCSV)} />
            <Route path='/login' component={LoginTab} />
        </Route>
    </Router>
)


// <Route path=”/” component={App}>
//   <Route path=”cart” component={Cart}/>
//   <Route path=”login” component={Login}/>

//   <Route component={EnsureLoggedInContainer}>
//     <Route path=”checkout” component={Checkout}/>
//     <Route path=”account” component={Account}/>
//   </Route>
// </Route>
export default routes;

