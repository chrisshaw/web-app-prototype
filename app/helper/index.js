var axios = require("axios");
import actions from '../actions';
// Helper Functions
var helpers = {
   
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
                        dispatch(actions.viewUploadedCSVData(response.data))
                })
            }
            reader.readAsBinaryString(file);
        }
    },
    updateCSV: function(action, id, type, dispatch){
        if (type === 'name'){
            dispatch(actions.updateCSVDataName(action, id ))
        }
        if (type === 'grade'){
            dispatch(actions.updateCSVDataGrade(action, id ))
        }
        if (type === 'focusArea'){
            dispatch(actions.updateCSVDataFA(action, id ))
        }
    },
    saveCSVData: function(data, dispatch){      
        if (data){
            return axios.post('/csv/data', data).then(function(response){
                dispatch(actions.viewUploadedCSVData([]));
                return;               
            })
        }
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
        // for now these are hard coded!!!!!
        var topicArr = [{_id: 0, name: "Immigration"}, {_id: 1, name: "Identity"}]
        dispatch(actions.updateTopicList(false, 0, topicArr))   
    },
    getStandards: function(dispatch){
        var standardsArr = [{_id: 0, name: "AP-ENG-LANG.R.3"}, {_id: 1, name: "CCSS.ELA-LITERACY.RL.9-10.3"}]
        dispatch(actions.updateStandardsList(false, 0, standardsArr))

    },
    getSubjectContents: function(dispatch){
        var subjectArr = [{_id: 0, name: "english"}, {_id: 1, name: "math"}]
        dispatch(actions.updateSubjectContentList(false, 0, subjectArr))
    },
    newPaths: function(paths, dispatch) {
        // clear old path data
        dispatch(actions.updatePathList(paths));
    },
    getPathsAll(groups, standards, topics, subjects, dispatch){
         var queryObj = {
            groups: groups,
            standards: standards,
            topics: topics,
            subjects: subjects
        }
        return axios.post('/api/path/all', queryObj).then(function(response) {
                    dispatch(actions.updatePathList(response.data));
                    return;
        })
    },
    removeGroup: function(id, dispatch) {
        dispatch(actions.updateGroupList(true, id))
    },
    removeTopic: function(id, dispatch) {
        dispatch(actions.updateTopicList(true, id))
    },
    removeSubject: function(id, dispatch) {
        dispatch(actions.updateSubjectContentList(true, id))
    },
    removeStandards: function(id, dispatch) {
        dispatch(actions.updateStandardsList(true, id))
    },
    updateSelectedGroup: function(e, addOrRemove, dispatch){
       dispatch(actions.saveSelectedGroup(addOrRemove, e));
    },
    updateSelectedTopic: function(e, addOrRemove, dispatch){
       dispatch(actions.saveSelectedTopics(addOrRemove, e));
    },
    updateSelectedSubject: function(e, addOrRemove, dispatch){
       dispatch(actions.saveSelectedSubjects(addOrRemove, e));
    },
    updateSelectedStandards: function(e, addOrRemove, dispatch){
       dispatch(actions.saveSelectedStandards(addOrRemove, e));
    },
    // Authentication
    // authAction == "Login" or "Sign Up"
    loginOrRegister(email, password, authAction, dispatch){
        // send to api for auth
        // console.log(email, password, authAction);
        if (authAction === 'Login'){
             let userObj = { 
                "username": email,
                "password": password
            }
            // console.log(userObj);
            return axios.post('http://146.148.55.53:8529/_db/skdb/auth/login', userObj).then(function(response) {
                // console.log(response.data.success)  // true if successful
                dispatch(actions.userLogin(response.data.success))
                return;
            }).catch(function(error) {
                // console.log(error);
                dispatch(actions.userLoginError(true))
                return;
            })

        } else if (authAction === 'Sign Up'){
            let userObj = { 
                "username": email,
                "password": password
            }
            // console.log(userObj);
            return axios.post('http://146.148.55.53:8529/_db/skdb/auth/signup', userObj).then(function(response) {
                // dispatch(actions.updatePathList(response.data));
                // console.log(response.data.success)  // true if successful
                dispatch(actions.userLogin(response.data.success))
                return;
            }).catch(function(error) {
                 dispatch(actions.userLoginError(true))
                //  console.log(error)
                 return;
            })
            

        }
    },

    logout(dispatch){
        // send to api for auth
        console.log("logout");
        // set logged in to false
        dispatch(actions.userLogin(false))
     }
 };


// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;