import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateProfile } from '@/redux/slices/userSlice';
import { router } from 'expo-router';
import { AppDispatch } from '@/redux/store';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

export default function ProfileSetupScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  const [formData, setFormData] = useState({
    aadhaar: '',
    passport: '',
    startDate: '',
    endDate: '',
    locations: '',
  });
  
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [passportImage, setPassportImage] = useState<string | null>(null);

  const pickImage = async (type: 'aadhaar' | 'passport') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'aadhaar') {
        setAadhaarImage(result.assets[0].uri);
      } else {
        setPassportImage(result.assets[0].uri);
      }
    }
  };
  const handleSubmit = async () => {
    try {
      await dispatch(updateProfile({
        aadhaar: formData.aadhaar,
        passport: formData.passport,
        itinerary: {
          startDate: formData.startDate,
          endDate: formData.endDate,
          locations: formData.locations.split(',').map(l => l.trim()),
        }
      })).unwrap();

      Alert.alert('Success', 'Profile updated successfully');
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('kycSubmission')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('aadhaarNumber')}</Text>
            <TextInput
              style={styles.input}
              value={formData.aadhaar}
              onChangeText={(text) => setFormData({ ...formData, aadhaar: text })}
              placeholder="Enter Aadhaar Number"
              keyboardType="numeric"
              maxLength={12}
            />
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={() => pickImage('aadhaar')}
            >
              <Camera size={20} color="#2563EB" />
              <Text style={styles.imagePickerText}>Upload Aadhaar Photo</Text>
            </TouchableOpacity>
            {aadhaarImage && (
              <Image source={{ uri: aadhaarImage }} style={styles.previewImage} />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('passportNumber')}</Text>
            <TextInput
              style={styles.input}
              value={formData.passport}
              onChangeText={(text) => setFormData({ ...formData, passport: text })}
              placeholder="Enter Passport Number"
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={() => pickImage('passport')}
            >
              <Camera size={20} color="#2563EB" />
              <Text style={styles.imagePickerText}>Upload Passport Photo</Text>
            </TouchableOpacity>
            {passportImage && (
              <Image source={{ uri: passportImage }} style={styles.previewImage} />
            )}
          </View>

          <Text style={styles.sectionTitle}>{t('itinerary')}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('startDate')}</Text>
            <TextInput
              style={styles.input}
              value={formData.startDate}
              onChangeText={(text) => setFormData({ ...formData, startDate: text })}
              placeholder="DD/MM/YYYY"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('endDate')}</Text>
            <TextInput
              style={styles.input}
              value={formData.endDate}
              onChangeText={(text) => setFormData({ ...formData, endDate: text })}
              placeholder="DD/MM/YYYY"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('locations')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.locations}
              onChangeText={(text) => setFormData({ ...formData, locations: text })}
              placeholder="Enter locations separated by commas"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>{t('submit')}</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#16A34A',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  imagePickerText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  previewImage: {
    width: 100,
    height: 60,
    borderRadius: 8,
    marginTop: 8,
  },
});