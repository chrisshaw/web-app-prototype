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
     
   }
   

   


 };
// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;