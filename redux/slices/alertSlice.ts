import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { alertService } from '@/services/alertService';
import { Alert, SafetyScore, PanicAlert } from '@/types/api';

interface AlertState {
  safetyScore: SafetyScore | null;
  notifications: Alert[];
  panicHistory: PanicAlert[];
  alertsSummary: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: AlertState = {
  safetyScore: null,
  notifications: [],
  panicHistory: [],
  alertsSummary: null,
  isLoading: false,
  error: null,
};

export const fetchSafetyScore = createAsyncThunk(
  'alerts/fetchSafetyScore',
  async () => {
    const response = await alertService.getSafetyScore();
    return response;
  }
);

export const fetchNotifications = createAsyncThunk(
  'alerts/fetchNotifications',
  async () => {
    const response = await alertService.getNotifications();
    return response;
  }
);

export const triggerPanic = createAsyncThunk(
  'alerts/triggerPanic',
  async (panicData: any) => {
    const response = await alertService.triggerPanic(
      panicData.location,
      panicData.audioFile,
      panicData.videoFile
    );
    return response;
  }
);

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSafetyScore.fulfilled, (state, action) => {
        state.safetyScore = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.isLoading = false;
      })
      .addCase(triggerPanic.fulfilled, (state, action) => {
        state.panicHistory.unshift(action.payload);
        state.isLoading = false;
      });
  }
});

export const { clearError, markNotificationRead } = alertSlice.actions;
export default alertSlice.reducer;