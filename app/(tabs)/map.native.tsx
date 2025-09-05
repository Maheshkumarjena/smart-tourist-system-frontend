import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
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
  
  const [region, setRegion] = useState({
    latitude: 26.1445, // Default to Guwahati
    longitude: 91.7362,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
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
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {currentLocation && (
          <>
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title={t('currentLocation')}
              description={getZoneText(currentZone)}
            />
            <Circle
              center={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              radius={500}
              fillColor={`${getZoneColor(currentZone)}20`}
              strokeColor={getZoneColor(currentZone)}
              strokeWidth={2}
            />
          </>
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={[styles.zoneIndicator, { backgroundColor: getZoneColor(currentZone) }]}>
          <Text style={styles.zoneText}>{getZoneText(currentZone)}</Text>
        </View>
        
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
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
  },
  zoneIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
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
    alignSelf: 'flex-end',
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