import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import reducer from '../reducers';
import { fetchStudentsList } from '../actions/studentsTab';
import { composeWithDevTools } from 'redux-devtools-extension'

const configureStore = ( initialState = {} ) => {
    // var store = createStore(reducer, initialState, compose(
    //   autoRehydrate()
    // ));
    
    const store = createStore(
        reducer,
        initialState,
        composeWithDevTools(
            applyMiddleware(thunkMiddleware)
        )
    );
    // store.dispatch(fetchStudentsList()); // Not sure why this is here...?
    // persistStore(store).purge(); /// leave this in for now......
    // persistStore(store);
    return store;
}

export default configureStore;
