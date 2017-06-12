var axios = require("axios");

import {focusAreaResults, noResults, viewDetailFocusArea} from '../actions';

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
   
    submitCSVFile: function(e){
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

                        // console.log(postObj);
                        
                        return axios.post('/csv/file', postObj).then(function(result){
                                console.log("result of save", result);

                                // indicate if successful or not
                                // store.dispatch({
                                //     type: 'UPDATE_PROFILEIMAGE',
                                //     profile_image: result.data
                                // })
                                // console.log("waht is this value", result.data.imgsrc);
                                // console.log("profile iage",store.getState())
                        })
                    }
                    reader.readAsBinaryString(file);
                }
    },

   


 };
// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;