import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { locationService } from '@/services/locationService';
import { LocationPing } from '@/types/api';

interface LocationState {
  currentLocation: LocationPing | null;
  locationHistory: LocationPing[];
  currentZone: 'safe' | 'risky' | 'restricted' | null;
  queuedPings: LocationPing[];
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  currentLocation: null,
  locationHistory: [],
  currentZone: null,
  queuedPings: [],
  isTracking: false,
  isLoading: false,
  error: null,
};

export const sendLocationPing = createAsyncThunk(
  'location/sendPing',
  async (location: LocationPing) => {
    const response = await locationService.sendLocationPing(location);
    return response;
  }
);

export const checkCurrentZone = createAsyncThunk(
  'location/checkZone',
  async (coords: { latitude: number; longitude: number }) => {
    const response = await locationService.checkZone(coords.latitude, coords.longitude);
    return response;
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    queueLocationPing: (state, action) => {
      state.queuedPings.push(action.payload);
    },
    clearQueuedPings: (state) => {
      state.queuedPings = [];
    },
    setTracking: (state, action) => {
      state.isTracking = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLocationPing.fulfilled, (state, action) => {
        state.locationHistory.unshift(action.payload);
      })
      .addCase(checkCurrentZone.fulfilled, (state, action) => {
        state.currentZone = action.payload.zoneType;
      });
  }
});

export const { setCurrentLocation, queueLocationPing, clearQueuedPings, setTracking } = locationSlice.actions;
export default locationSlice.reducer;