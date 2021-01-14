import axios from 'axios'

export const httpClient = axios.create({
    baseURL: '/api/v1'
})

httpClient.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token/access');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
});
