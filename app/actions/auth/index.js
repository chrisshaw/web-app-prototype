import callApi from '../../helper/api'

import {
    LOGGED_IN,
    LOGIN_ERROR,
    SIGN_UP_STATUS,
    SIGN_UP_FIELDS,
    GET_ROLES,
    SIGN_UP_USER_FAILED,
    SIGN_UP_USER,
    SIGN_UP_USER_SUCCESS,
    PASSWORD_CHANGE,
    PASSWORD_CHANGE_FAILED,
    PASSWORD_CHANGE_SUCCESS
} from './actionTypes'

export const userLogin = data => ({
    type: LOGGED_IN,
    data
})

export const userLoginError = (loginError, errorMsg) => ({
    type: LOGIN_ERROR,
    loginError,
    errorMsg
})

export const signUpUser = signupObject => ({
    type: SIGN_UP_USER,
    payload: { signupObject }
})

export const signUpUserFailed = error => ({
    type: SIGN_UP_USER_FAILED,
    payload: { error }
})

export const signUpUserComplete = () => ({
    type: SIGN_UP_USER_SUCCESS,
    payload: { message: 'User signed up!' }
})

export const trySignUpUser = signupObject => async dispatch => {
    dispatch(signUpUser(signUpObject))
    try {
        const result = await callApi('post', 'signup', { ...signUpObject, chgPwd: true } )
        if (true) {
            dispatch(signUpUserComplete())
        } else {
            throw new Error('Something went wrong.')
        }
    } catch (error) {
        dispatch(signUpUserFailed(error))
    }
}

const changePassword = password => ({
    type: PASSWORD_CHANGE,
    payload: { password }
})

const changePasswordComplete = () => ({
    type: PASSWORD_CHANGE_SUCCESS,
    payload: { message: 'Password successfully updated!' }
})

const changePasswordFailed = error => ({
    type: PASSWORD_CHANGE_FAILED,
    payload: { error }
})

export const tryChangePassword = (password, router) => async dispatch => {
    dispatch(changePassword(password))
    try {
        const result = await callApi('post', 'password', { password })
        if (true) {
            dispatch(changePasswordComplete())
            router.push('/build-path')
        } else {
            throw new Error('Something went wrong.')
        }
    } catch (error) {
        dispatch(changePasswordFailed(error))
    }
}
