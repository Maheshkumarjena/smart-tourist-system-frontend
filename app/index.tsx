import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { authService } from '@/services/authService';

export default function RootScreen() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await authService.getStoredToken();
      if (token && isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    } catch (error) {
      router.replace('/(auth)/welcome');
    }
  };

  return null;
}