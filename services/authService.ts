import api from './api';
import * as SecureStore from 'expo-secure-store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/api/v1/auth/register', data);
    if (response.data.token) {
      await SecureStore.setItemAsync('jwt_token', response.data.token);
    }
    return response.data;
  },

  async login(credentials: LoginCredentials) {
    const response = await api.post('/api/v1/auth/login', credentials);
    if (response.data.token) {
      await SecureStore.setItemAsync('jwt_token', response.data.token);
    }
    return response.data;
  },

  async verifyOtp(otp: string) {
    const response = await api.post('/api/v1/auth/verify-otp', { otp });
    console.log('OTP Verification (mocked):', otp);
    return response.data;
  },

  async logout() {
    await SecureStore.deleteItemAsync('jwt_token');
  },

  async getStoredToken() {
    return await SecureStore.getItemAsync('jwt_token');
  }
};