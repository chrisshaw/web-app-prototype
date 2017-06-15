import uuid from 'uuid';

// // new way
// module.exports = (state, action) => {

//   switch(action.type){

//     case 'ADD_TODO':
//       var newTodos = [
//         ...state.todos,
//         {
//           text: action.text,
//           id: uuid.v4()
//         }
//       ]
//       return {todos: newTodos};
//     case 'DELETE_TODO':
//         var newTodos = state.todos.filter((todo) => {
//             if (todo.id === action.id){
//               return false;
//             }
//             return true;

//           });
//         return {todos: newTodos};
//     default:
//       return state;
//   }
// }
// old way
// the reducer function
import {combineReducers } from 'redux';

const intialstate = {
  toggledrawer: false,
  grouplist: [],
  grouptabs: [],
  selectedgrouplist: [],
  initialSearchTerms: [],
  paths: [],  
}
//  The below are required and map to the components dispatcher
const mainReducer = (state={intialstate}, action) => {

    // SEARCH_TEXT
    switch(action.type){
        // case 'FOCUS_AREA':
        //     return Object.assign({},state, {area: action.area});    
        // case 'NO_DATA_MSG':
        //     return Object.assign({},state, {noResultsMsg: action.noResultsMsg});    
        // case 'VIEW_DETAIL':
        //     return Object.assign({},state, {fadetail: action.fadetail});    
        case 'VIEW_CSV_DATA':
            return Object.assign({},state, {csvdata: action.csvdata}); 
        case 'UPDATE_CSV_NAME':
            return Object.assign({},state, {
                csvdata: state.csvdata.map(data => data.id === action.id ?
                    // transform the one with a matching id
                    { ...data, name: action.name } : 
                    // otherwise return original data
                    data
                ) 
            })   
        case 'UPDATE_CSV_GRADE':
            return Object.assign({},state, {
                csvdata: state.csvdata.map(data => data.id === action.id ?
                    // transform the one with a matching id
                    { ...data, grade: action.grade } : 
                    // otherwise return original data
                    data
                ) 
            })    
        case 'UPDATE_CSV_FA':
            return Object.assign({},state, {
            
                csvdata: state.csvdata.map(data => data.id === action.id ?
                    // transform the one with a matching id
                    { ...data, focusArea: action.focusArea } : 
                    // otherwise return original data
                    data
                ) 
            })    
        case 'TOGGLE_DRAWER':
            return Object.assign({},state, {toggledrawer: action.toggledrawer});    
        case 'UPDATE_PATHS':
        
            console.log("in update paths state.paths", state.paths)
             console.log("in update paths  action.paths", action.paths);
            // if ((Object.keys(action.paths).length !== 0) && (state.paths)){
            if (!action.newPaths) {
                console.log('in update path should be false:', action.newPaths);
                return Object.assign({},state, {paths: [...state.paths, action.paths]});
        //    } else if (!state.paths) {
             } else if (action.newPaths) {
                 console.log('in update path should be true:', action.newPaths);
                return Object.assign({},state, {paths: [action.paths]});
           }
        case 'UPDATE_SEARCH_TERMS':
           // clear out old state if a new search
           if (!action.newSearch) {
                // console.log("serach terms", state.searchTerms)
                //  console.log('should be false:', action.newSearch);
                return Object.assign({},state, {initialSearchTerms: [...state.initialSearchTerms, action.initialSearchTerms]});
           } else if (action.newSearch) {
               // append serach items to state in a current search
            //    console.log('should be true:', action.newSearch);
                // console.log("serach terms", state.searchTerms, action.searchTerms)
                return Object.assign({},state, {initialSearchTerms: [action.initialSearchTerms]});
           }
        case 'UPDATE_GROUPS':
            // see what action is being performed - delete or add
            let newObj = {};
            if (action.delete) {
                // use filter here to remove deleted group
                // remove from selectedgrouplist and add back to grouplist
                var newGroups = state.selectedgrouplist.filter((group) => {
                    if (group.id === action.id){
                        newObj = group;
                        return false;
                    }
                    return true;

                });
                
                // in case of corrupt data 
                if (newObj !== {}){
                    // update
                    return Object.assign({},state, {selectedgrouplist: newGroups, grouplist: [...state.grouplist, newObj] }); 
                } else {
                    // no change
                    return Object.assign({},state, {selectedgrouplist: state.selectedgrouplist, grouplist: state.grouplist }); 
                }
            } 
            else {
                return Object.assign({},state, {grouplist: action.grouplist, selectedgrouplist: []});    
            }
        case 'UPDATE_SELECTED_GROUPS':
        // console.log(state.selectedgrouplist)
            // see what action is being performed - delete or add
            let newItem ="";
            if (action.delete) {
                // console.log(action.delete, "in  delreducer")
                // use filter here to remove deleted group name from selected list
                var newGroups = state.selectedgrouplist.filter((group) => {
                    // add it back to the grouplist...
                    if (group.name === action.item){
                        return false;
                    }
                    return true;

                });
                return Object.assign({},state, {selectedgrouplist: newGroups}); 
            
            } 
            else {
                // decrease groups list and increase selected
                let newObj = {};
                var newGroups = state.grouplist.filter((group) => {
                    
                    if (group.name === action.item){
                        newObj = group;
                        return false;
                        }
                        return true;

                    });

               if (newObj !== {}){
                   // if new Obj is not empty make changes
                    if (!state.selectedgrouplist) {
                        // initially when array is empty do this
                        return Object.assign({selectedgrouplist: []},state, {selectedgrouplist:  [newObj],  grouplist: newGroups});    
                    } else {     
                        // after there is at least one item do this
                        return Object.assign({selectedgrouplist: []},state, {selectedgrouplist:  [...state.selectedgrouplist, newObj], grouplist: newGroups});    
                    }
               }
                
                
            } 
    };
        
    return state;
}

//  The below are required and map to the components dispatcher
// const userReducer = (state={}, action) => {
  
//     // switch(action.type){
//     //     case 'ADD_USERNAME':
//     //         return Object.assign({},state, {username: action.username})
      
//     //     }
//     return state;
// }

const reducers = combineReducers({
    mainState : mainReducer

})

export default reducers;

