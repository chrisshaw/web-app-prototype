var axios = require("axios");
import {focusAreaResults} from '../actions';

// Helper Functions
var helpers = {
   sendSearchQuery: function(value, dispatch){
       // hardcoded to grade 6 for testing
       return axios.get('/focusarea/6').then(function(response) {
           console.log("focus area", response.data);
            // send results to redux store for use by Results component
            dispatch(focusAreaResults(response.data))
            return ;
        })
   }


 };
// We export the helpers function (which contains getGithubInfo)
module.exports = helpers;