import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common';
import { Colors, Typography } from '../../styles';
import { formatCalories, formatNumber } from '../../utils';

interface ResultCardProps {
  title: string;
  value: number;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'success';
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  subtitle,
  variant = 'default',
}) => {
  return (
    <Card style={[styles.card, styles[variant]]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, styles[`${variant}Value`]]}>
        {formatCalories(value)}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginBottom: 12,
  },
  default: {
    backgroundColor: Colors.surface,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  success: {
    backgroundColor: Colors.success,
  },
  title: {
    ...Typography.caption,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  value: {
    ...Typography.h2,
    fontSize: 32,
    fontWeight: 'bold',
  },
  defaultValue: {
    color: Colors.text,
  },
  primaryValue: {
    color: Colors.surface,
  },
  successValue: {
    color: Colors.surface,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 4,
    color: Colors.textSecondary,
  },
});

export default ResultCard;
