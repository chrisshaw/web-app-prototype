import { LOGGED_IN, LOGIN_ERROR, GET_ROLES, SIGN_UP_STATUS, SIGN_UP_FIELDS, SIGN_UP_USER, SIGN_UP_USER_SUCCESS, SIGN_UP_USER_FAILED } from '../actions/auth/actionTypes';

const initialState = {
    loggedIn: false,
    permissions: [],
    loginError: false,
}

export default (state = initialState, action) => {
    switch(action.type){    
        case LOGGED_IN:
            return Object.assign( {}, state, {
                loggedIn: action.data.success,
                username: action.data.username,
                userId: action.data.id,
                permissions: action.data.permissions,
                role: action.data.role
            });
        case LOGIN_ERROR:
            return Object.assign( { loginError: false }, state, { loginError: action.loginError, errorMsg: action.errorMsg }); 
        case SIGN_UP_USER_SUCCESS:
            return { ...state, signupOk: true } 
        case SIGN_UP_USER_FAILED:
            return { ...state, signupOk: false }
        );
    };      
    return state;
}