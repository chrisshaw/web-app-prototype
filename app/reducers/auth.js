import { LOGGED_IN, LOGIN_ERROR, GET_ROLES, SIGN_UP_STATUS, SIGN_UP_FIELDS } from '../actions/auth/actionTypes';

const initialState = {
    loggedIn: false,
    permissions: [],
    loginError: false,
    signupFields: {
        email: '', 
        password : '', 
        first: '',
        last: '',
        company: '',
        verify: '', 
        selectedRole: 'Please Select a Role',
        description: '',
        error: false, 
        errorMsg: ""
    }
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
        case GET_ROLES:
            return Object.assign( {}, state, { roles: action.roles } );
        case SIGN_UP_STATUS:
            return Object.assign( { signupOk: false }, state, { signupOk: action.signupOk, statusMsg: action.statusMsg }); 
        case SIGN_UP_FIELDS:
            return Object.assign( {
                signupFields:  {
                    email: '', 
                    password : '', 
                    first: '',
                    last: '',
                    school: '',
                    verify: '', 
                    selectedRole:  'Please Select a Role',
                    description: '',
                    error: false, 
                    errorMsg: ""
                }
            }, state, { signupFields: action.signupFields }
        );
    };      
    return state;
}