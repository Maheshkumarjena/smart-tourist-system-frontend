import api from './api';
import { User, EmergencyContact } from '@/types/api';

export const userService = {
  async updateProfile(profileData: any) {
    const response = await api.post('/api/v1/user/profile', profileData);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/api/v1/user/profile');
    return response.data;
  },

  async getCurrentTrip() {
    const response = await api.get('/api/v1/user/current-trip');
    return response.data;
  },

  async saveEmergencyContacts(contacts: EmergencyContact[]) {
    const response = await api.post('/api/v1/user/emergency-contacts', { contacts });
    return response.data;
  },

  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    const response = await api.get('/api/v1/user/emergency-contacts');
    return response.data;
  },

  async updateSettings(settings: any) {
    const response = await api.post('/api/v1/user/settings', settings);
    return response.data;
  },

  async issueDigitalId() {
    const response = await api.post('/api/v1/blockchain/issue-id');
    return response.data;
  },

  async getQrCode(id: string) {
    const response = await api.get(`/api/v1/blockchain/qr/${id}`);
    return response.data;
  }
};