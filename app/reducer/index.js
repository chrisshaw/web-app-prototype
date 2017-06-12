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

//  The below are required and map to the components dispatcher
const mainReducer = (state={}, action) => {
    // SEARCH_TEXT
    switch(action.type){
        case 'FOCUS_AREA':
            return Object.assign({},state, {area: action.area});    
        case 'NO_DATA_MSG':
            return Object.assign({},state, {noResultsMsg: action.noResultsMsg});    
        case 'VIEW_DETAIL':
            return Object.assign({},state, {fadetail: action.fadetail});    
        case 'VIEW_CSV_DATA':
            return Object.assign({},state, {csvdata: action.csvdata}); 
        }
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

