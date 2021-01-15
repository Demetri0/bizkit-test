import axios from 'axios'

export const httpClient = axios.create({
    baseURL: 'https://stage.feelmingo.com/myapi/v1'
})

httpClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token/access');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});
