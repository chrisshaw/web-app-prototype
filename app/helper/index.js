var axios = require("axios");

import {focusAreaResults, noResults, viewDetailFocusArea, viewUploadedCSVData, updateCSVDataName, updateCSVDataGrade, updateCSVDataFA} from '../actions';

// Helper Functions
var helpers = {
   sendSearchQuery: function(value, dispatch){
       console.log("value", value);
       // hardcoded to grade 6 for testing - need to pass in the value
       return axios.get('/focusarea/6').then(function(response) {
            // send results to redux store for use by Results component
            dispatch(focusAreaResults(response.data))
            return ;
        })
   },
   clearResults: function(noDataMsg, dispatch){
       // clear stored results
        dispatch(focusAreaResults(""));
        dispatch(noResults(noDataMsg));
   },
   getFADetails: function(faDetails, dispatch){
        console.log("faDetails", faDetails); 
   },
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
       

    }

   


 };
// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;