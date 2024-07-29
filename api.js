import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
    baseURL: 'http://192.168.0.103:8000/api',
});

instance.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;
if (error.response) {
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if(refreshToken) {
            try {
                const response = await instance.post('/token/refresh/', {
                    refresh: refreshToken,
                });
                await AsyncStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return instance(originalRequest);
            } catch(refreshError) {
                return Promise.reject(refreshError);
            }
        }
    }
    return Promise.reject(error);
} else if (error.request) {
    console.error("Network error", error);
    return Promise.reject(new Error("Network error. Please check your internet connection."));
} else {
    return Promise.reject(error);
}
})

export default instance;