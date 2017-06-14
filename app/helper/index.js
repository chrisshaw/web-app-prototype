var axios = require("axios");

import {updatePathList, saveSelectedGroup, updateGroupList, viewUploadedCSVData, updateCSVDataName, updateCSVDataGrade, updateCSVDataFA, closePathBuilderDrawer} from '../actions';

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
               
                if (files) {
                    //send only the first one
                    var file = files[0];
                    //read the file content and prepare to send it
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var buffer = e.target.result;
                        console.log(buffer);
                        var postObj = {
                            name: file.name,
                            buffer: buffer
                        }; 

                        
                        return axios.post('/csv/file', postObj).then(function(response){
                            console.log(response.data)
                               dispatch(viewUploadedCSVData(response.data))

                        
                        })
                    }
                    reader.readAsBinaryString(file);
                }
    },

    updateCSV: function(action, id, type, dispatch){
        console.log(action, id);
        if (type === 'name'){
            dispatch(updateCSVDataName(action, id ))
        }
        if (type === 'grade'){
            dispatch(updateCSVDataGrade(action, id ))
        }
        if (type === 'focusArea'){
            dispatch(updateCSVDataFA(action, id ))
        }
       

    },

    toggleDrawer: function(action, dispatch){
        console.log("toggledrawer", action);
        dispatch(closePathBuilderDrawer(action))
    },
    // deletes groups from path builder list when deleted
    editGroupsList: function(action, dispatch){
        // dispatch(updateGroupList(action));
    },
    getGroups: function(dispatch){
        // console.log("in here get groups")
        return axios.get('/api/teacher/group').then(function(response) {
            // send results to redux store for use by Results component
                // console.log("getgroups results", response.data);
            dispatch(updateGroupList(false, 0, response.data.groups));
            console.log(response.data.groups);
            return ;
        })
    },
    removeGroup: function(id, dispatch) {
        dispatch(updateGroupList(true, id))
    },
    updateSelectedGroup: function(e, addOrRemove, dispatch){
        //addOrRemove == true then remove
        //addOrRemove == false then add
        //  dispatch(updateGroupList(false, id))
        console.log("in here", addOrRemove );
       dispatch(saveSelectedGroup(addOrRemove, e));
    },
    getPaths: function(dispatch){
         return axios.get('/api/path').then(function(response) {
            // send results to redux store for use by Results component
                console.log("paths", response.data);
                dispatch(updatePathList(response.data));
                return ;
        })

    }

 };
// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;