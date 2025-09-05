import api from './api';
import { Alert, SafetyScore, PanicAlert } from '@/types/api';

export const alertService = {
  async triggerPanic(location: LocationPing, audioFile?: string, videoFile?: string) {
    const response = await api.post('/api/v1/alerts/panic', {
      location,
      audioFile,
      videoFile
    });
    return response.data;
  },

  async getSafetyScore(): Promise<SafetyScore> {
    const response = await api.get('/api/v1/ai/safety-score');
    return response.data;
  },

  async getAlertsSummary() {
    const response = await api.get('/api/v1/alerts/tourist-summary');
    return response.data;
  },

  async getPanicHistory(): Promise<PanicAlert[]> {
    const response = await api.get('/api/v1/alerts/history');
    return response.data;
  },

  async getNotifications(): Promise<Alert[]> {
    const response = await api.get('/api/v1/alerts/notifications');
    return response.data;
  },

  async markNotificationRead(id: string) {
    const response = await api.post(`/api/v1/alerts/notifications/${id}/read`);
    return response.data;
  }
};