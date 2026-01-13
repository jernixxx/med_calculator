import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Button, Card, ResultCard } from '../components';
import { Colors, Typography, CommonStyles } from '../styles';
import { CalculationResult } from '../models';
import { formatWeight, formatHeight, formatGender, formatActivityLevel } from '../utils';

interface ResultScreenProps {
  navigation: any;
  route: {
    params: {
      calculation: CalculationResult;
    };
  };
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { calculation } = route.params;
  const { bmr, tdee, input, interpretation } = calculation;

  const handleNewCalculation = () => {
    navigation.navigate('Calculation');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Результаты расчета</Text>

        {/* Основные результаты */}
        <ResultCard
          title="Базовый метаболизм (BMR)"
          value={bmr}
          subtitle="Калорий в состоянии покоя"
          variant="primary"
        />

        <ResultCard
          title="Суточная потребность (TDEE)"
          value={tdee}
          subtitle="С учетом активности"
          variant="success"
        />

        {/* Целевые калории */}
        <Card>
          <Text style={styles.sectionTitle}>Целевые калории</Text>
          
          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Поддержание веса:</Text>
            <Text style={styles.targetValue}>
              {interpretation.targetCaloriesMaintain} ккал
            </Text>
          </View>

          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Снижение веса:</Text>
            <Text style={[styles.targetValue, { color: Colors.primary }]}>
              {interpretation.targetCaloriesLose} ккал
            </Text>
          </View>

          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Набор веса:</Text>
            <Text style={[styles.targetValue, { color: Colors.success }]}>
              {interpretation.targetCaloriesGain} ккал
            </Text>
          </View>
        </Card>

        {/* Параметры расчета */}
        <Card>
          <Text style={styles.sectionTitle}>Параметры</Text>
          <Text style={styles.paramText}>
            Вес: {formatWeight(input.weight)}
          </Text>
          <Text style={styles.paramText}>
            Рост: {formatHeight(input.height)}
          </Text>
          <Text style={styles.paramText}>
            Возраст: {input.age} лет
          </Text>
          <Text style={styles.paramText}>
            Пол: {formatGender(input.gender)}
          </Text>
          <Text style={styles.paramText}>
            Активность: {formatActivityLevel(input.activityLevel)}
          </Text>
        </Card>

        {/* Рекомендации */}
        <Card>
          <Text style={styles.sectionTitle}>Рекомендации</Text>
          {interpretation.recommendations.map((rec, index) => (
            <Text key={index} style={styles.recommendation}>
              • {rec}
            </Text>
          ))}
        </Card>

        {/* Предупреждения */}
        {interpretation.warnings.length > 0 && (
          <Card style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ Важно знать</Text>
            {interpretation.warnings.map((warning, index) => (
              <Text key={index} style={styles.warning}>
                • {warning}
              </Text>
            ))}
          </Card>
        )}

        {/* Действия */}
        <View style={styles.actions}>
          <Button
            title="Новый расчет"
            onPress={handleNewCalculation}
            variant="primary"
            style={styles.button}
          />
          <Button
            title="На главную"
            onPress={handleGoHome}
            variant="outline"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  content: {
    padding: 16,
  },
  title: {
    ...Typography.h2,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: 12,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  targetLabel: {
    ...Typography.body1,
    color: Colors.textSecondary,
  },
  targetValue: {
    ...Typography.body1,
    fontWeight: '600',
    color: Colors.text,
  },
  paramText: {
    ...Typography.body2,
    marginBottom: 6,
    color: Colors.textSecondary,
  },
  recommendation: {
    ...Typography.body2,
    marginBottom: 8,
    lineHeight: 20,
  },
  warningCard: {
    backgroundColor: Colors.warning + '33',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 12,
    borderRadius: 12,
  },
  warningTitle: {
    ...Typography.h4,
    marginBottom: 8,
    color: Colors.warning,
  },
  warning: {
    ...Typography.body2,
    marginBottom: 6,
    lineHeight: 20,
    color: Colors.text,
  },
  actions: {
    marginTop: 8,
  },
  button: {
    marginBottom: 12,
  },
});

export default ResultScreen;
