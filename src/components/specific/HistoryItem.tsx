import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../common';
import { Colors, Typography } from '../../styles';
import { CalculationResult } from '../../models';
import {
  formatCalories,
  formatDate,
  formatGender,
  formatActivityLevel,
  formatFormulaType,
} from '../../utils';

interface HistoryItemProps {
  calculation: CalculationResult;
  onPress?: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ calculation, onPress }) => {
  const { bmr, tdee, input, createdAt } = calculation;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
          <Text style={styles.formula}>{formatFormulaType(input.formulaType)}</Text>
        </View>
        
        <View style={styles.row}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>BMR</Text>
            <Text style={styles.resultValue}>{formatCalories(bmr)}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>TDEE</Text>
            <Text style={styles.resultValue}>{formatCalories(tdee)}</Text>
          </View>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.detailText}>
            {input.weight} кг • {input.height} см • {input.age} лет
          </Text>
          <Text style={styles.detailText}>
            {formatGender(input.gender)} • {formatActivityLevel(input.activityLevel)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    ...Typography.body2,
    fontWeight: '600',
    color: Colors.text,
  },
  formula: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.primary,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 8,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default HistoryItem;
