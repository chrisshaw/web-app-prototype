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
        case 'UPDATE_GROUPS':
            // see what action is being performed - delete or add
            if (action.delete) {
                // use filter here to remove deleted group
                var newGroups = state.grouplist.filter((group) => {
                    console.log("in here", action.id, "group id", group.id);
                    if (group.id === action.id){
                    return false;
                    }
                    return true;

                });
                return Object.assign({},state, {grouplist: newGroups}); 
            
            } else {
                return Object.assign({},state, {grouplist: action.grouplist});    
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

