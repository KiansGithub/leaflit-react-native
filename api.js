import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
    baseURL: 'https://leaflit-api-f4f7ada6a8f6.herokuapp.com/api',
});

instance.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('access_token');
    console.log("Request intercepted. Token:", token);
    if (token && !config.headers['No-Auth']) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    console.error("Request error", error);
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    console.log("Response received:", response);
    return response;
}, async error => {
    const originalRequest = error.config;
if (error.response) {
    console.error("Response error", JSON.stringify(error.toJSON(), null, 2));
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
                await AsyncStorage.removeItem('access_token');
                await AsyncStorage.removeItem('refresh_token');

                console.error("Token refresh failed", refreshError);
                return Promise.reject(refreshError);
            }
        }
    }
    
    // Avoid logging error if retry successful 
    if (error.response.status !== 401 || originalRequest._retry) {
        console.error("Response error", error);
    }
} else if (error.request) {
    console.error("Network error", error);
    return Promise.reject(new Error("Network error. Please check your internet connection."));
} else {
    return Promise.reject(error);
}
return Promise.reject(error);
});

export default instance;