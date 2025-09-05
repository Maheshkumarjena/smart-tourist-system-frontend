import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/userService';
import { User, EmergencyContact } from '@/types/api';

interface UserState {
  profile: User | null;
  emergencyContacts: EmergencyContact[];
  currentTrip: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  emergencyContacts: [],
  currentTrip: null,
  isLoading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async () => {
    const response = await userService.getProfile();
    return response;
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: any) => {
    const response = await userService.updateProfile(profileData);
    return response;
  }
);

export const fetchEmergencyContacts = createAsyncThunk(
  'user/fetchEmergencyContacts',
  async () => {
    const response = await userService.getEmergencyContacts();
    return response;
  }
);

export const saveEmergencyContacts = createAsyncThunk(
  'user/saveEmergencyContacts',
  async (contacts: EmergencyContact[]) => {
    const response = await userService.saveEmergencyContacts(contacts);
    return response;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
        state.emergencyContacts = action.payload;
      })
      .addCase(saveEmergencyContacts.fulfilled, (state, action) => {
        state.emergencyContacts = action.payload;
      });
  }
});

export const { clearError, setProfile } = userSlice.actions;
export default userSlice.reducer;