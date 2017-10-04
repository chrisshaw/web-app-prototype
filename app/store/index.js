import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import reducer from '../reducer';
import { fetchStudentsList } from '../actions/studentsTab';

const configureStore = (initialState={}) => {
    // var store = createStore(reducer, initialState, compose(
    //   autoRehydrate()
    // ));
    var store = createStore(reducer, initialState, applyMiddleware(thunkMiddleware));
    store.dispatch(fetchStudentsList());
    // persistStore(store).purge(); /// leave this in for now......
    // persistStore(store);
    return store;
}

export default configureStore;
