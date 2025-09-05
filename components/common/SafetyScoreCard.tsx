import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafetyScore } from '@/types/api';

interface SafetyScoreCardProps {
  safetyScore: SafetyScore | null;
}

export default function SafetyScoreCard({ safetyScore }: SafetyScoreCardProps) {
  const { t } = useTranslation();

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#16A34A'; // Green
    if (score >= 40) return '#CA8A04'; // Yellow
    return '#DC2626'; // Red
  };

  const getScoreText = (score: number) => {
    if (score >= 70) return 'Safe';
    if (score >= 40) return 'Moderate';
    return 'High Risk';
  };

  if (!safetyScore) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading safety score...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('safetyScore')}</Text>
      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: getScoreColor(safetyScore.score) }]}>
          {safetyScore.score}
        </Text>
        <Text style={[styles.scoreText, { color: getScoreColor(safetyScore.score) }]}>
          {getScoreText(safetyScore.score)}
        </Text>
      </View>
      <View style={styles.factorsContainer}>
        <View style={styles.factor}>
          <Text style={styles.factorLabel}>Location</Text>
          <Text style={styles.factorValue}>{safetyScore.factors.location}</Text>
        </View>
        <View style={styles.factor}>
          <Text style={styles.factorLabel}>Weather</Text>
          <Text style={styles.factorValue}>{safetyScore.factors.weather}</Text>
        </View>
        <View style={styles.factor}>
          <Text style={styles.factorLabel}>Crowd</Text>
          <Text style={styles.factorValue}>{safetyScore.factors.crowd}</Text>
        </View>
        <View style={styles.factor}>
          <Text style={styles.factorLabel}>Crime</Text>
          <Text style={styles.factorValue}>{safetyScore.factors.crime}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  loading: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
  },
  factorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  factor: {
    alignItems: 'center',
    flex: 1,
  },
  factorLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  factorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});