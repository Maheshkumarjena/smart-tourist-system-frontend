import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { userService } from '@/services/userService';
import QRCode from 'react-native-qrcode-svg';
import { RefreshCw } from 'lucide-react-native';

export default function DigitalIdScreen() {
  const { t } = useTranslation();
  const { profile } = useSelector((state: RootState) => state.user);
  const [qrData, setQrData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateQrCode();
  }, []);

  const generateQrCode = async () => {
    try {
      setIsLoading(true);
      
      if (!profile?.digitalId) {
        const idResponse = await userService.issueDigitalId();
        console.log('Digital ID issued:', idResponse);
      }

      const qrResponse = await userService.getQrCode(profile?.id || '');
      setQrData(qrResponse.qrCode || `tourist-id-${Date.now()}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate QR code');
      setQrData(`tourist-id-${Date.now()}`); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('digitalId')}</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={generateQrCode}
          disabled={isLoading}
        >
          <RefreshCw size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.idCard}>
          <Text style={styles.cardTitle}>Tourist Digital Identity</Text>
          
          {profile && (
            <View style={styles.profileInfo}>
              <Text style={styles.profileText}>Name: Tourist User</Text>
              <Text style={styles.profileText}>Email: {profile.email}</Text>
              <Text style={styles.profileText}>
                ID: {profile.digitalId || 'Generating...'}
              </Text>
            </View>
          )}

          <View style={styles.qrContainer}>
            {qrData ? (
              <QRCode
                value={qrData}
                size={200}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.placeholderText}>
                  {isLoading ? 'Generating QR...' : 'QR Code'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.instructionText}>
            Show this QR code at hotels, tourist spots, and checkpoints for verification
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to use</Text>
          <Text style={styles.infoText}>
            • Present this QR code at entry points{'\n'}
            • Keep your phone charged for verification{'\n'}
            • Take a screenshot as backup{'\n'}
            • Refresh if QR code expires
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  idCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  profileInfo: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  profileText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});