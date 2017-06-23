var axios = require("axios");

// import {initialQueryData, updatePathList, saveSelectedGroup, updateGroupList, viewUploadedCSVData, updateCSVDataName, updateCSVDataGrade, updateCSVDataFA, closePathBuilderDrawer} from '../actions';
import actions from '../actions';
// Helper Functions
var helpers = {
//    sendSearchQuery: function(value, dispatch){
//        console.log("value", value);
//        // hardcoded to grade 6 for testing - need to pass in the value
//        return axios.get('/focusarea/6').then(function(response) {
//             // send results to redux store for use by Results component
//             dispatch(focusAreaResults(response.data))
//             return ;
//         })
//    },
//    clearResults: function(noDataMsg, dispatch){
//        // clear stored results
//         dispatch(focusAreaResults(""));
//         dispatch(noResults(noDataMsg));
//    },
//    getFADetails: function(faDetails, dispatch){
//         console.log("faDetails", faDetails); 
//    },
//    submitCSVFile: function(file){
//       console.log("in here", file[0]);
//    }
   
    submitCSVFile: function(e, dispatch){
                var files = e.target.files || e.dataTransfer.files 
            //    console.log("in here uploading file")
                if (files) {
                    //send only the first one
                    var file = files[0];
                    //read the file content and prepare to send it
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var buffer = e.target.result;
                        // console.log(buffer);
                        var postObj = {
                            name: file.name,
                            buffer: buffer
                        }; 

                        
                        return axios.post('/csv/file', postObj).then(function(response){
                            // console.log(response.data)
                               dispatch(actions.viewUploadedCSVData(response.data))

                        
                        })
                    }
                    reader.readAsBinaryString(file);
                }
    },

    updateCSV: function(action, id, type, dispatch){
        // console.log(action, id);
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
             console.log("data to be saved", data)
            return axios.post('/csv/data', data).then(function(response){
            console.log("in here......")
            // clear out data ???????
            dispatch(actions.viewUploadedCSVData([]));
            return;               
        })

        }

    },
    toggleDrawer: function(action, dispatch){
        // console.log("toggledrawer", action);
        dispatch(actions.closePathBuilderDrawer(action))
    },
    // deletes groups from path builder list when deleted
    editGroupsList: function(action, dispatch){
        // dispatch(updateGroupList(action));
    },
    getGroups: function(dispatch){
        // console.log("in here get groups")
        //  console.log("in here");
        return axios.get('/api/teacher/group').then(function(response) {
            // console.log("is there data", response.data);
            // send results to redux store for use by Results component
                // console.log("getgroups results", response.data);
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
        // console.log("here too")
        // var topicArr = [{id: 0, name: "Immigration"}, {id: 1, name: "Identity"}]
        return axios.get('/api/focusarea').then(function(response) {
            // console.log("is there data", response.data);
            // send results to redux store for use by Results component
                // console.log("getgroups results", response.data);
            dispatch(actions.getFAList(response.data))
            return;
        })
        // console.log("getting topics", topicArr);
       
       
    },
    getTopics: function(dispatch){
        // for now these are hard coded!!!!!
        var topicArr = [{id: 0, name: "Immigration"}, {id: 1, name: "Identity"}]
        // console.log("getting topics", topicArr);
        dispatch(actions.updateTopicList(false, 0, topicArr))
       
    },
    getStandards: function(dispatch){
        // console.log("getting getStandards");
        var standardsArr = [{id: 0, name: "AP-ENG-LANG.R.3"}, {id: 1, name: "CCSS.ELA-LITERACY.RL.9-10.3"}]
        // console.log("getting standards", standardsArr);
        dispatch(actions.updateStandardsList(false, 0, standardsArr))

    },
    getSubjectContents: function(dispatch){
        // console.log("getting getSubjectContents");
        // ['AP-ENG-LANG.R.3', 'CCSS.ELA-LITERACY.RL.9-10.3'];
        var subjectArr = [{id: 0, name: "english"}, {id: 1, name: "math"}]
        // console.log("getting standardsArr", subjectArr);
        dispatch(actions.updateSubjectContentList(false, 0, subjectArr))
    },
    // get FA and Grade for selected groups
    getFAandGrade: function(selectedGroups, selectedStandards, selectedTopics, selectedSubjects, i, dispatch){
        // console.log("selectedGroups", selectedGroups, i );
        return new Promise((resolve, reject) => {
            // for (var i = 0; i < selectedGroups.length; i++){

                var newSearch = true;
            
                // var foundCounter = 0;

                var searchTerm=selectedGroups[i].id + "/" + selectedGroups[i].name  ;
                // console.log(searchTerm);
                // console.log(i, "searchTerm", searchTerm);
                axios.get('/api/fa/grade/'+searchTerm).then(function(response) {
                   
                    if (Object.keys(response.data).length > 0){
                        if (i > 0) {
                            newSearch = false;
                        }
                        
            
                    
                        // add other search params to intial search terms
                        //     console.log("response.data", response.data);
                        //     console.log("in FA", selectedGroups, selectedStandards, selectedTopics, selectedSubjects);
                        response.data.filter = {
                            standards: selectedStandards,
                            topics: selectedTopics,
                            subjects: selectedSubjects
                        }
                        //  console.log("response.data", response.data);
                        dispatch(actions.initialQueryData(response.data, newSearch));
                    }    
                    //  console.log("fa and grade i", i);
                     //return array containing i and path arr
                     // this will be results[0] and results[1] below
                    return i;         
                }).then((i) => resolve(i))
            })
        // }) 
    },
    newPaths: function(paths, dispatch) {
        // clear old path data
        dispatch(actions.updatePathList(paths));
    },
    getPaths: function(searchArr, i, dispatch){
        // for each group / fa do a query
        // for (var i=0; i < searchArr.length; i++){ 
            // var newPaths = true;
            // console.log(" i, pathArr in helper get pathx",  i)
            // console.log("xxx", i, searchArr[i])
            // var foundCounter = 0;
            return axios.post('/api/path/', searchArr[i]).then(function(response) {
                    // send results to redux store for use by Results component
                    // console.log('/api/path/', i, searchArr[i],response.data);
                    // if (Object.keys(response.data).length !== 0){
                        // console.log("in here", i);
                        // if (i > 0) {
                        //     // console.log('newPaths', newPaths);
                        //     newPaths = false;
                        // }
                        // foundCounter++;
                        // console.log('found counter', foundCounter);
                        // let currenathArr
                        // pathArr.push(reponse.data);
                        // console.log("path returned",i, response.data);

                        // dispatch(actions.updatePathList(response.data, newPaths));
                    // } else if (Object.keys(response.data).length === 0) {

                    // }
                   
                    return [i, response.data];
            })
        // }
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
 };
// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;