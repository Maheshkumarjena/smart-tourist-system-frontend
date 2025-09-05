import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import alertSlice from './slices/alertSlice';
import locationSlice from './slices/locationSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'alerts', 'location']
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);
const persistedAlertReducer = persistReducer(persistConfig, alertSlice);
const persistedLocationReducer = persistReducer(persistConfig, locationSlice);

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: persistedUserReducer,
    alerts: persistedAlertReducer,
    location: persistedLocationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;