import api from './api';
import { LocationPing } from '@/types/api';

export const locationService = {
  async sendLocationPing(location: LocationPing) {
    const response = await api.post('/api/v1/location/ping', location);
    return response.data;
  },

  async getLocationHistory() {
    const response = await api.get('/api/v1/location/history');
    return response.data;
  },

  async checkZone(latitude: number, longitude: number) {
    const response = await api.get('/api/v1/location/check', {
      params: { latitude, longitude }
    });
    return response.data;
  }
};