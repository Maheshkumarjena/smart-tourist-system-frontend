import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import PanicButton from '@/components/common/PanicButton';

export default function EmergencyScreen() {
  const { currentLocation } = useSelector((state: RootState) => state.location);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PanicButton currentLocation={currentLocation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});