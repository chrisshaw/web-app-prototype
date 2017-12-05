var axios = require("axios");
import actions from '../actions';
import { fetchStudentsList } from '../actions/studentsTab';
import { fetchCoursesList } from '../actions/class';
import { fetchTeachersAndAdmins } from '../actions/teachersAndAdmins';
// import {connect} from 'react-redux';
// import store from '../store';

// console.log(store)
var helpers = {
    getCookie: function(c_name) {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    let c_end = document.cookie.indexOf(";", c_start);
                        if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    },
    saveSelectedFA(e, dispatch){
        // need name and id
       dispatch(actions.selectedFA(e));

    },
    getFocusArea(dispatch) {
        // for now these are hard coded!!!!!
        return axios.get('/api/focusarea').then(function(response) {
            // send results to redux store for use by Results component
            console.log("focus areas", response.data)
            dispatch(actions.getFAList(response.data))
            return;
        }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })   
    },
    // this path is for new query based on project
    getPathProjectAll(courses, grades, standards, topics, subjects, role, dispatch){
         var queryObj = {
            courses: courses,
            grades: grades,
            standards: standards,
            topics: topics,
            subjects: subjects,
            role: role
        }
        dispatch(actions.updatePathList("", true, true));
        return axios.post('/api/path/project', queryObj).then( function(response) {
            console.log(response.data);
            dispatch(actions.updatePathList(response.data, false, false));            
        }
            // post the ids to the db to get names back then add them to the results set before sending paths to the store
            // this is expensive calc as we will need 2  * 3 = 6 for loops each of order n3 (n-cubed)
        ).catch((error) => {
            // send message to client...needs work
            console.log("this is an error", error);
        })  
    },

    setErrorMsg(props){
        props.dispatch(actions.setError(false, ""))
    },
    setSuccessMsg(props){
        props.dispatch(actions.setSuccess(false, ""))
    },
    moveFaUp(studentPosition, projPosition, faPosition, props){
        console.log("move Up studentPosition, projPosition, faPosition",  studentPosition, projPosition, faPosition)
        // this is the UP arrow on the Focus Area - moves one position up so that means down a position in the array
        if (faPosition > 0){
            props.paths[studentPosition].projectPath[projPosition].fa.splice(faPosition-1, 0,  props.paths[studentPosition].projectPath[projPosition].fa.splice(faPosition, 1)[0]);
            props.dispatch(actions.updatePathList(props.paths, false, false )); 
        }
    },
    moveFaDown(studentPosition, projPosition, faPosition, props){  
         console.log("move down studentPosition, projPosition, faPosition",  studentPosition, projPosition, faPosition)
        // this is the DOWN arrow on the Focus Area - moves one position down - that means up a position in the array
        if (faPosition < props.paths[studentPosition].projectPath[projPosition].fa.length-1){
            props.paths[studentPosition].projectPath[projPosition].fa.splice(faPosition+1, 0,  props.paths[studentPosition].projectPath[projPosition].fa.splice(faPosition, 1)[0]);
            props.dispatch(actions.updatePathList(props.paths, false, false )); 
        }  
    },
    removeFA(studentPathPosition,projPosition, idCounter, studentKey, faKey, props){
       // removed: do quick check to make sure the correct fa is being removed
    //    if ((props.paths[studentPathPosition].student._key === studentKey) && (faKey === props.paths[studentPathPosition].projects[projPosition].fa[idCounter]._key)){
            // remove 1 FA at array position idCounter
            props.paths[studentPathPosition].projectPath[projPosition].fa.splice(idCounter, 1);
            // do some processing to get nextFA and nextStd
            // helpers.parseFa(props.paths[studentPathPosition]);    
            props.dispatch(actions.updatePathList( props.paths, false, false ));  
    //    }
   
    },
    removeProject(studentPathPosition, projPosition, props){
        // remove empty project 
        console.log("in here", studentPathPosition, projPosition)
        props.paths[studentPathPosition].projectPath.splice(projPosition, 1);
        // do some processing to get nextFA and nextStd
        // helpers.parseFa(props.paths[studentPathPosition]);    
        props.dispatch(actions.updatePathList(props.paths, false, false ));  

    },
    addFA(studentPathPosition, projPosition, idCounter, studentKey, faKey, addFAKey, props){
       // do quick check to make sure the correct fa is being removed
       let addAfterKey = 0;
       if ((faKey) && (props.paths[studentPathPosition].projectPath[projPosition].fa.length > 0)){
            addAfterKey = props.paths[studentPathPosition].projectPath[projPosition].fa[idCounter]._key;
       } 
    //    if ((props.paths[studentPathPosition].student._key === studentKey) && (faKey === addAfterKey)){
            // remove 1 FA at array position idCounter
            // for now it jst adds a copy
            // get fa details from databsae
        return axios.get('/api/fa/'+addFAKey).then(function(response) {
            // console.log(props.paths)
            // console.log("response fa", response.data.fa[0])
            if (response.data.success){
                // response.data == fa details
                props.paths[studentPathPosition].projectPath[projPosition].fa.splice(idCounter+1, 0, response.data.fa[0]);
                // do some processing to get nextFA and nextStd
                // helpers.parseFa(props.paths[studentPathPosition]);
                props.dispatch(actions.updatePathList( props.paths, false, false )); 
                // reset selected FA
                helpers.saveSelectedFA("", props.dispatch);
            } else {
                // send error message
            }   
            return;
        }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  
           
    //    }
   
    },
    getUserFA(uid, dispatch){
        return axios.get(`/api/user/${uid}/focusAreas`).then(function(response) {
            if (response.data.success){
                dispatch(actions.focusAreas(response.data.fa))
            } else {
                // send error message
            }   
            return;
        }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })
    },
    removeChip(id, queryitem, dispatch){
        if  (queryitem === "Topics") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_TOPICS'));
        }  else if  (queryitem === "Standards") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_STANDARDS'));
        }  else if  (queryitem === "Subjects") {
            dispatch(actions.updateList( false, true, id, 'UPDATE_SUBJECTS'))  
        }  else if  (queryitem === "Grades") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_GRADES'));   // reset, delete,  id
        }   else if  (queryitem === "Courses") {
            dispatch(actions.updateList(false, true, id, 'UPDATE_COURSES')); // reset, delete,  id
        }
    },
    // use to update all query items
    updateSelected(e, queryitem, dispatch){
        if (queryitem === "Groups"){
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_GROUPS'));
        } else if  (queryitem === "Topics") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_TOPICS'));
        }  else if  (queryitem === "Standards") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_STANDARDS'));
        }  else if  (queryitem === "Subjects") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_SUBJECTS'));
        }   else if  (queryitem === "Grades") {
            console.log("what is this", e)
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_GRADES'));
        }   else if  (queryitem === "Courses") {
            dispatch(actions.saveSelected(e, 'UPDATE_SELECTED_COURSES'));
        }
    },
    showView(action, dispatch){
        dispatch(actions.setPage(action));
    },
    getRoles(dispatch) {
        // return ['admin', 'teacher', 'user', 'internal']
        return axios.get('/api/roles/all').then(function(response) {
            // send results to redux store for use by SignUp component
            dispatch(actions.getRoles(response.data));
            return;
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })   
    },
    addInitialRows(displayFA, dispatch){
        dispatch(actions.showInitialRows(displayFA));
    },
    addRows(index, newvalue, dispatch){
        dispatch(actions.showMoreRows(index, newvalue ));
    },
    loginUser(email, password, dispatch, router){      
        // capture data in object
        let userObj = { 
            "username": email.toLowerCase(),
            "password": password
        }
        // send request to server
        return axios.post('/login', userObj).then(function(response) {
            let msg = "Invalid username or password - please try again";
            // sets login to true or false as appropriate
            // saves the role and permssions and user data
            // dispatch(actions.userPerms(response.data));
            dispatch(actions.userLogin(response.data));
            dispatch(fetchStudentsList());
            dispatch(fetchCoursesList());
            dispatch(fetchTeachersAndAdmins());
            // captures error and sends any relevant message to UI
            dispatch(actions.userLoginError(!response.data.success, msg));
            // successful login route to default page
            // capture redirect and make change passowrd
            // console.log("chg pwd:", response.data.chgPwd);
            // if a new user force them to create their own secret password 
            // if not new the just log in as normal
            if (response.data.chgPwd) {
                router.push('/password');
                // console.log('router', router);
            } else {
                router.push('/build-path');
            }
           
            return;
         }).catch((error) => {
            // send message to client...needs work
            console.log(error)
        })  
    },

    loginError(value, msg, dispatch){
         dispatch(actions.userLoginError(value, msg))
    },

    logout(dispatch, router){
        // send to api for auth
        // set logged in to false
        dispatch(actions.userLogin({loggedIn: false, username: null, permissions: [], role: null}));
        // clear redux store and reset
        dispatch(actions.userLogout());
        router.push('/login');
     }
 };
// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;