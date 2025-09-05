import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { triggerPanic } from '@/redux/slices/alertSlice';
import { LocationPing } from '@/types/api';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface PanicButtonProps {
  currentLocation: LocationPing | null;
}

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.6;

export default function PanicButton({ currentLocation }: PanicButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(0);
  const [isTriggering, setIsTriggering] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isTriggering) {
      handleSendSOS();
    }
  }, [countdown, isTriggering]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const startPanicSequence = () => {
    // Haptic feedback for emergency action
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Emergency SOS',
      'Are you sure you want to trigger emergency alert?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Emergency!',
          style: 'destructive',
          onPress: () => {
            setCountdown(5);
            setIsTriggering(true);
            scale.value = withRepeat(withTiming(1.1, { duration: 500 }), -1, true);
            
            // Continuous haptic feedback during countdown
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
          },
        },
      ]
    );
  };

  const cancelPanic = () => {
    setCountdown(0);
    setIsTriggering(false);
    scale.value = withTiming(1);
  };

  const handleSendSOS = async () => {
    try {
      if (!currentLocation) {
        Alert.alert('Error', 'Location not available');
        return;
      }

      // Mock audio/video recording
      const mockAudioFile = 'base64encodedaudio...';
      const mockVideoFile = 'base64encodedvideo...';

      await dispatch(triggerPanic({
        location: currentLocation,
        audioFile: mockAudioFile,
        videoFile: mockVideoFile
      }));

      Alert.alert('SOS Sent', 'Emergency services have been notified');
    } catch (error) {
      Alert.alert('Error', 'Failed to send SOS');
    } finally {
      setIsTriggering(false);
      scale.value = withTiming(1);
    }
  };

  if (isTriggering) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.countdownContainer, animatedStyle]}>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.countdownLabel}>
            {t('panicCountdown', { seconds: countdown })}
          </Text>
        </Animated.View>
        <TouchableOpacity style={styles.cancelButton} onPress={cancelPanic}>
          <Text style={styles.cancelText}>{t('cancelPanic')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.panicButton}
        onPress={startPanicSequence}
        activeOpacity={0.8}
      >
        <Text style={styles.panicText}>{t('panicButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  panicButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  panicText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countdownContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: 'bold',
  },
  countdownLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});