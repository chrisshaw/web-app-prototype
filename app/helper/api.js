import axios from 'axios'

const api = axios.create({
    baseURL: '/api/'
})

export default callApi = (method, url, params) => {
    if (method.toUpperCase() === 'GET') {
        return api.get(url, { params })
    } else if (['POST','PUT'].includes(method.toUpperCase())) {
        return api({
            method: method,
            url: url,
            data: params
        })
    } else {
        return new Error(`Method requested was ${method}. Only GET, POST, and PUT are supported.`)
    }
}