import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCurrentLocation, 
  sendLocationPing, 
  checkCurrentZone 
} from '@/redux/slices/locationSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { LocationPing } from '@/types/api';
import * as Location from 'expo-location';

export default function MapScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { currentLocation, currentZone, isTracking } = useSelector(
    (state: RootState) => state.location
  );

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        startLocationTracking();
      } else {
        Alert.alert('Location Permission', 'Location access is required for safety monitoring');
      }
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  const startLocationTracking = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const locationPing: LocationPing = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      dispatch(setCurrentLocation(locationPing));
      dispatch(sendLocationPing(locationPing));
      dispatch(checkCurrentZone({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));
    } catch (error) {
      console.error('Location tracking error:', error);
    }
  };

  const getZoneColor = (zone: string | null) => {
    switch (zone) {
      case 'safe':
        return '#16A34A';
      case 'risky':
        return '#CA8A04';
      case 'restricted':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const getZoneText = (zone: string | null) => {
    switch (zone) {
      case 'safe':
        return t('safe');
      case 'risky':
        return t('risky');
      case 'restricted':
        return t('restricted');
      default:
        return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Web placeholder for map - replace with web-compatible map library if needed */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderTitle}>Map View</Text>
        <Text style={styles.placeholderText}>
          Interactive map is available on mobile devices
        </Text>
        
        {currentLocation && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Current Location:</Text>
            <Text style={styles.locationText}>
              Lat: {currentLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Lng: {currentLocation.longitude.toFixed(6)}
            </Text>
            <View style={[styles.zoneIndicator, { backgroundColor: getZoneColor(currentZone) }]}>
              <Text style={styles.zoneText}>{getZoneText(currentZone)}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={startLocationTracking}
        >
          <Text style={styles.refreshText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>

      {!isTracking && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>{t('offline')}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    margin: 16,
    borderRadius: 12,
    padding: 24,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  locationInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
  zoneIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  zoneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  offlineIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 8,
  },
  offlineText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});