import {createStore, compose} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';
import reducer from '../reducer';

const configureStore = (initialState={}) => {
    var store = createStore(reducer, initialState, compose(
      autoRehydrate()
    ));
    persistStore(store).purge(); /// leave this in for now......
    persistStore(store);
    return store;
}

export default configureStore;
