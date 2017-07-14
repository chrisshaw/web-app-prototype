var axios = require("axios");
import actions from '../actions';
// import loginAPIKeys from '../../config/loginAPIKeys';
// import signUpAPIKeys from '../../config/signUpAPIKeys';
// Helper Functions

var helpers = {
   
    // submitCSVFile: function(e, dispatch){
    //     var files = e.target.files || e.dataTransfer.files 
    //     if (files) {
    //         //send only the first one
    //         var file = files[0];
    //         //read the file content and prepare to send it
    //         var reader = new FileReader();
    //         reader.onload = function(e) {
    //             var buffer = e.target.result;
    //             var postObj = {
    //                 name: file.name,
    //                 buffer: buffer
    //             };    
    //             return axios.post('/csv/file', postObj).then(function(response){
    //                     dispatch(actions.viewUploadedCSVData(response.data))
    //             })
    //         }
    //         reader.readAsBinaryString(file);
    //     }
    // },
    // $.ajaxSetup({
    //     beforeSend: function(xhr) {
    //       xhr.setRequestHeader("Accept", "application/vvv.website+json;version=1");
    //       xhr.setRequestHeader("Authorization", "Bearer " + getCookie('auth_token'));
    //     }
    // });

    //     headers: {
    //   'Content-Length': contentLength,
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },

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
    submitCSVFile: function(e, dispatch){
        var files = e.target.files || e.dataTransfer.files 
        if (files) {
            //send only the first one
            var file = files[0];
            //read the file content and prepare to send it
            var reader = new FileReader();
            reader.onload = function(e) {
                var buffer = e.target.result;
                var postObj = {
                    name: file.name,
                    buffer: buffer
                };    
                return axios.post('/csv/file', postObj).then(function(response){
                    console.log("response", response.data);
                    dispatch(actions.viewUploadedCSVData(response.data.results, response.data.error))          
                })
            }
            // reader.readAsBinaryString(file);
             reader.readAsText(file);
        }
    },
    // updateCSV: function(action, id, type, dispatch){
    //     if (type === 'name'){
    //         dispatch(actions.updateCSVDataName(action, id ))
    //     }
    //     if (type === 'grade'){
    //         dispatch(actions.updateCSVDataGrade(action, id ))
    //     }
    //     if (type === 'focusArea'){
    //         dispatch(actions.updateCSVDataFA(action, id ))
    //     }
    // },
    // saveCSVData: function(data, dispatch){      
    //     if (data){
    //         return axios.post('/csv/data', data).then(function(response){
    //             dispatch(actions.viewUploadedCSVData([]));
    //             return;               
    //         })
    //     }
    // }
    saveCSVStudentData(data, dispatch){
        let component = this;
        // need to pass the auth header in the cookie to server
        let USER_TOKEN = helpers.getCookie("x-session-id");
        // console.log("USER_TOKEN", USER_TOKEN);
        // const AuthStr = 'USER_TOKEN); 
        // axios.get(URL, { headers: { Authorization: AuthStr } })
        // console.log("cookie", cookie)
        if (data){
            return axios({
                method: 'post',
                url: '/csv/students/courses/data', 
                data: data,
                headers: {'x-session-id': USER_TOKEN}
            })
            .then(function(response) {           
                // this will clear the data from the upload Page after saving....
                // by settting csvdata to ""
                dispatch(actions.viewUploadedCSVData(""));
                // success or failure - return mesage to client this.props.dataupload = boolean
                console.log("csv upload", response.data.error )
                component.dataUploadStatus(response.data.success, response.data.error, dispatch);
                return;               
            })
        }
    },
    dataUploadStatus(response, error, dispatch){
        console.log("being called...");
        dispatch(actions.returnUploadedStatus(response, error));
    },
    toggleDrawer: function(action, dispatch){
        dispatch(actions.closePathBuilderDrawer(action))
    },
    // deletes groups from path builder list when deleted
    // editGroupsList: function(action, dispatch){
    //     // dispatch(updateGroupList(action));
    // },
    getGroups: function(dispatch){
        return axios.get('/api/teacher/group').then(function(response) {
            // send results to redux store for use by Results component
            dispatch(actions.updateGroupList(false, 0, response.data));
            return response.data;
        })
    },
    getGrades: function(dispatch){
       var gradeArr = [{_id: 0, name: "6"}, {_id: 1, name: "7"},{_id: 2, name: "8"}, {_id: 3, name: "9"},{_id: 4, name: "10"}, {_id: 5, name: "11"}]
       dispatch(actions.updateGradeList(false, 0, gradeArr));
        // return axios.get('/api/teacher/group').then(function(response) {
        //     // send results to redux store for use by Results component
        //     dispatch(actions.updateGroupList(false, 0, response.data));
        //     return response.data;
        // })
    },
    getCourses: function(grade, dispatch){
        /// parse array to a string for query.
        let gradeString = "";
        if (grade.length > 0) {
            if (grade.length === 1){
                gradeString = grade[0].name;
            } else {
                gradeString = grade[0].name;
                for (var i = 1; i < grade.length; i++){
                    
                    gradeString +=  ',' + grade[i].name;
                }
            }
        }
        return axios.get('/api/courses/'+gradeString).then(function(response) {
            console.log("courses", response)
                // send results to redux store for use by Results component
                dispatch(actions.updateCourseList(false, 0, response.data));
                return;
        })
       
    },
    saveSelectedFA(e, dispatch){
        // need name and id
       dispatch(actions.saveSelectedFA(e));

    },
    getFocusArea: function(dispatch){
        // for now these are hard coded!!!!!
        return axios.get('/api/focusarea').then(function(response) {
            // send results to redux store for use by Results component
            dispatch(actions.getFAList(response.data))
            return;
        })     
    },
    getTopics: function(dispatch){
        return axios.get('/api/topics/all').then(function(response) {
            // send results to redux store for use by Results component
            /// need to put in an object with an id 
            var topicArr = [];
            for (var i = 0; i < response.data.length; i++){
                // console.log("topics i", response.data[i])
                topicArr.push({ _id: i, name: response.data[i].toLowerCase()})
            }
            dispatch(actions.updateTopicList(false, 0, topicArr))  
            return;
        }) 
    },
    getStandards: function(grade, dispatch){
        /// parse array to a string for query.
        let gradeString = "";
        if (grade.length > 0) {
            if (grade.length === 1){
                gradeString = grade[0].name;
            } else {
                gradeString = grade[0].name;
                for (var i = 1; i < grade.length; i++){
                    console.log("standards", grade[i].name)
                    gradeString +=  ',' + grade[i].name;
                    // queryGrades.push(req.params.grade[i].name);
                }
            }
            // var standardsArr = [{_id: 0, name: "AP-ENG-LANG.R.3"}, {_id: 1, name: "CCSS.ELA-LITERACY.RL.9-10.3"}]
        }
        return axios.get('/api/standards/'+gradeString).then(function(response) {
                // send results to redux store for use by Results component
                /// need to put in an object with an id
                //  console.log("standards" ,response.data)
                var standardsArr = [];
                for (var i = 0; i < response.data[0].length; i++){
                    standardsArr.push({ _id: i, name: response.data[0][i]})
                }
                dispatch(actions.updateStandardsList(false, 0, standardsArr))
                return;
            }) 
    },
    getSubjectContents: function(dispatch){
        var subjectArr = [{_id: 0, name: "english"}, {_id: 1, name: "math"}, {_id: 2, name: "science"}, {_id: 3, name: "social studies"}]
        dispatch(actions.updateSubjectContentList(false, 0, subjectArr))
    },
    newPaths: function(paths, dispatch) {
        // clear old path data
        dispatch(actions.updatePathList(paths));
    },
    getPathsAll(courses, grades, standards, topics, subjects, dispatch){
         var queryObj = {
            courses: courses,
            grades: grades,
            standards: standards,
            topics: topics,
            subjects: subjects
        }
        dispatch(actions.searchPaths(true));
        return axios.post('/api/path/all', queryObj).then(function(response) {
            dispatch(actions.updatePathList(response.data));
            // hide the searching message
            dispatch(actions.searchPaths(false));
            // console.log("response: ", pathArr);
            return;
            // }
        })
    },
    // pathsRendered(pathsrendered, dispatch){
    //     dispatch(actions.pathsRendered(pathsrendered))
    // },
    // removeGroup: function(id, dispatch) {
    //     dispatch(actions.updateGroupList(true, id))
    // },
    // removeTopic: function(id, dispatch) {
    //     dispatch(actions.updateTopicList(true, id))
    // },
    // removeSubject: function(id, dispatch) {
    //     dispatch(actions.updateSubjectContentList(true, id))
    // },
    // removeStandards: function(id, dispatch) {
    //     dispatch(actions.updateStandardsList(true, id))
    // },
    removeChip: function(id, queryitem, dispatch){
        if (queryitem === "Groups"){
            dispatch(actions.updateGroupList(true, id));
        } else if  (queryitem === "Topics") {
            dispatch(actions.updateTopicList(true, id));
        }  else if  (queryitem === "Standards") {
            dispatch(actions.updateStandardsList(true, id));
        }  else if  (queryitem === "Subjects") {
            dispatch(actions.updateSubjectContentList(true, id))
        }  else if  (queryitem === "Grades") {
            dispatch(actions.updateGradeList(true, id));
        }   else if  (queryitem === "Courses") {
            dispatch(actions.updateCourseList(true, id));
        }
    },
    // use to update all query items
    updateSelected: function(e, addOrRemove, queryitem, dispatch){
        if (queryitem === "Groups"){
            dispatch(actions.saveSelectedGroup(addOrRemove, e));
        } else if  (queryitem === "Topics") {
            dispatch(actions.saveSelectedTopics(addOrRemove, e));
        }  else if  (queryitem === "Standards") {
            dispatch(actions.saveSelectedStandards(addOrRemove, e));
        }  else if  (queryitem === "Subjects") {
            dispatch(actions.saveSelectedSubjects(addOrRemove, e));
        }   else if  (queryitem === "Grades") {
            dispatch(actions.saveSelectedGrade(addOrRemove, e));
        }   else if  (queryitem === "Courses") {
            dispatch(actions.saveSelectedCourse(addOrRemove, e));
        }
    },
    showView: function(action, dispatch){
        dispatch(actions.setPage(action));
    },
    loginOrRegister(email, password, authAction, dispatch){      
        // capture data in object
        if (authAction === 'Login'){
             let userObj = { 
                "username": email,
                "password": password
            }
            // send request to server
            return axios.post('/login', userObj).then(function(response) {
                let msg = "Invalid username or password - please try again";
                dispatch(actions.userLogin(response.data.success));
                dispatch(actions.userLoginError(!response.data.success, msg))
                return;
            })
        } else if (authAction === 'Sign Up'){
            // capture data in object
            let userObj = { 
                "username": email,
                "password": password
            }
            // send request to server
            return axios.post('/signup', userObj).then(function(response) {  
                let msg = "Invalid username or user already exists or password - please try again";      
                dispatch(actions.userLogin(response.data.success));
                dispatch(actions.userLoginError(!response.data.success, msg));
                return;
            })
        }
    },
    
    loginError(value, msg, dispatch){
         dispatch(actions.userLoginError(value, msg))
    },

    logout(dispatch){
        // send to api for auth
        // set logged in to false
        dispatch(actions.userLogin(false));
        // clear redux store and reset
        dispatch(actions.userLogout());
     }
 };


// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;