import axios from 'axios'

export const httpClient = axios.create({
    baseURL: '/api/v1'
})

httpClient.interceptors.request.use(function (config) {
    // const tmpJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjEwNjI5NzMxLCJqdGkiOiJjZTFhYTgxODU4NzY0ZDI1OTU2ODVmZmM5ZWE4MjYzNyIsInVzZXJfaWQiOiI2MWQwNjk5MC1jYjM2LTQ3YTItYmJjZS03N2YwODFkNWYyMGEifQ.yWId5dR9P0YieCnrXpZa9E_OxG7C2CukAxU6K2oWrLk'
    // localStorage.setItem('token/access', tmpJWT)
    // console.log('test')
    const token = localStorage.getItem('token/access');
    console.log(token)
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});
