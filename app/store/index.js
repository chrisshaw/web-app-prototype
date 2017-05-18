import {createStore, compose} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';
import reducer from '../reducer';

// var defaultState = {
// };

const configureStore = (initialState={}) => {
    var store = createStore(reducer, initialState, compose(
      autoRehydrate()
    ));
    persistStore(store);
    return store;
}

export default configureStore;
