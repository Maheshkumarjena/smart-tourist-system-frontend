import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSafetyScore } from '@/redux/slices/alertSlice';
import { fetchProfile } from '@/redux/slices/userSlice';
import { RootState, AppDispatch } from '@/redux/store';
import SafetyScoreCard from '@/components/common/SafetyScoreCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { safetyScore, isLoading } = useSelector((state: RootState) => state.alerts);
  const { profile, currentTrip } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    dispatch(fetchSafetyScore());
    dispatch(fetchProfile());
  };

  const onRefresh = () => {
    loadDashboardData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Welcome back, {profile?.email?.split('@')[0] || 'Tourist'}!
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        <SafetyScoreCard safetyScore={safetyScore} />

        {currentTrip && (
          <View style={styles.tripCard}>
            <Text style={styles.cardTitle}>{t('currentTrip')}</Text>
            <Text style={styles.tripInfo}>
              {currentTrip.startDate} - {currentTrip.endDate}
            </Text>
            <Text style={styles.tripLocations}>
              {currentTrip.locations?.join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.alertsCard}>
          <Text style={styles.cardTitle}>{t('recentAlerts')}</Text>
          <View style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: '#16A34A' }]} />
            <Text style={styles.alertText}>Current area is safe for tourists</Text>
          </View>
          <View style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: '#CA8A04' }]} />
            <Text style={styles.alertText}>Heavy rainfall expected this evening</Text>
          </View>
          <View style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.alertText}>Tourist festival happening nearby</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tripInfo: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 8,
  },
  tripLocations: {
    fontSize: 14,
    color: '#6B7280',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
});