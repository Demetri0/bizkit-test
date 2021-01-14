import axios from 'axios'

export const httpClient = axios.create({
    baseURL: 'http://194.67.90.67/api/v1'
})

httpClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token/access');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});
