import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  Shield, 
  MapPin, 
  Bell,
  ChevronRight 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [locationTracking, setLocationTracking] = useState(true);
  const [emergencySharing, setEmergencySharing] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'bn', name: 'বাংলা' },
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <ChevronRight size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          {renderSettingItem(
            <Globe size={24} color="#2563EB" />,
            t('language'),
            `Current: ${languages.find(l => l.code === i18n.language)?.name || 'English'}`,
            undefined,
            () => {
              // Show language picker
            }
          )}

          {renderSettingItem(
            <Bell size={24} color="#2563EB" />,
            'Notifications',
            'Receive safety alerts and updates',
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={notifications ? '#2563EB' : '#9CA3AF'}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy')}</Text>
          
          {renderSettingItem(
            <MapPin size={24} color="#16A34A" />,
            t('locationTracking'),
            'Allow continuous location monitoring',
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
              thumbColor={locationTracking ? '#16A34A' : '#9CA3AF'}
            />
          )}

          {renderSettingItem(
            <Shield size={24} color="#DC2626" />,
            t('emergencySharing'),
            'Share data with emergency services',
            <Switch
              value={emergencySharing}
              onValueChange={setEmergencySharing}
              trackColor={{ false: '#D1D5DB', true: '#FCA5A5' }}
              thumbColor={emergencySharing ? '#DC2626' : '#9CA3AF'}
            />
          )}
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Language Options</Text>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                i18n.language === language.code && styles.selectedLanguage
              ]}
              onPress={() => changeLanguage(language.code)}
            >
              <Text style={[
                styles.languageText,
                i18n.language === language.code && styles.selectedLanguageText
              ]}>
                {language.name}
              </Text>
            </TouchableOpacity>
          ))}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  languageSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedLanguage: {
    backgroundColor: '#EFF6FF',
  },
  languageText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedLanguageText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});