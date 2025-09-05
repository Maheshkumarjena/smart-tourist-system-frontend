import * as Location from 'expo-location';
import { locationService } from '@/services/locationService';
import OfflineQueue from './offlineQueue';

const handleLocationUpdate = async (location: Location.LocationObject) => {
  const locationPing = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: new Date().toISOString(),
  };

  try {
    await locationService.sendLocationPing(locationPing);
  } catch (error) {
    // If offline, add to queue
    const offlineQueue = OfflineQueue.getInstance();
    await offlineQueue.addToQueue({
      url: '/api/v1/location/ping',
      method: 'POST',
      data: locationPing,
    });
  }
};

export class LocationTracker {
  static async startTracking() {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        throw new Error('Foreground location permission not granted');
      }

      // For Expo Go, we'll use foreground location tracking only
      console.log('Location tracking permission granted');
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  }

  static async stopTracking() {
    try {
      console.log('Background location tracking stopped');
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  }

  static async getCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }
}