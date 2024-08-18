import axios from "axios";


const $api = axios.create({
    // withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_API_URL,
});

$api.interceptors.request.use((config)=>{
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default $api;
