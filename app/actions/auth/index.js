import { LOGGED_IN, LOGIN_ERROR, SIGN_UP_STATUS, SIGN_UP_FIELDS, GET_ROLES } from './actionTypes'

export const userLogin = data => ({
    type: LOGGED_IN,
    data
})

export const userLoginError = (loginError, errorMsg) => ({
    type: LOGIN_ERROR,
    loginError,
    errorMsg
})

export const userSignUp = signupok => ({
    type: SIGN_UP_STATUS,
    signupok
})

export const signUpFields = signupFields => ({
    type: SIGN_UP_FIELDS,
    signupFields
})

export const getRoles = roles => ({
    type: GET_ROLES,
    roles
})