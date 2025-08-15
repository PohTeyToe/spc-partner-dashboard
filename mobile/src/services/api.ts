import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';

export const api = axios.create({
  baseURL: API_BASE_URL
});

if (__DEV__) {
  // Helpful to see which URL was picked
  // eslint-disable-next-line no-console
  console.log('[API] baseURL =', API_BASE_URL);
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-console
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

