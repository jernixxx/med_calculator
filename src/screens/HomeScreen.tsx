import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Button, Card } from '../components';
import { Colors, Typography, CommonStyles } from '../styles';
import { APP_NAME } from '../utils';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleNewCalculation = () => {
    navigation.navigate('Calculation');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>
            Расчет базового метаболизма и суточной потребности в калориях
          </Text>
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Что такое BMR и TDEE?</Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>BMR</Text> (Basal Metabolic Rate) - базовый
            метаболизм, количество калорий, которое ваш организм сжигает в состоянии
            покоя.
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>TDEE</Text> (Total Daily Energy Expenditure) -
            общая суточная потребность в энергии с учетом вашей физической активности.
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Новый расчет"
            onPress={handleNewCalculation}
            variant="primary"
            style={styles.button}
          />
          <Button
            title="История расчетов"
            onPress={handleViewHistory}
            variant="outline"
            style={styles.button}
          />
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Возможности:</Text>
          <Text style={styles.featureItem}>✓ Точные медицинские формулы</Text>
          <Text style={styles.featureItem}>✓ Учет физической активности</Text>
          <Text style={styles.featureItem}>✓ Персонализированные рекомендации</Text>
          <Text style={styles.featureItem}>✓ История всех расчетов</Text>
          <Text style={styles.featureItem}>✓ Работа без интернета</Text>
        </View>

        {/* Disclaimer */}
        <Card style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Данные расчеты носят справочный характер. Для медицинских назначений
            проконсультируйтесь с врачом.
          </Text>
        </Card>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 24,
  },
  infoTitle: {
    ...Typography.h3,
    marginBottom: 12,
  },
  infoText: {
    ...Typography.body2,
    marginBottom: 8,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: Colors.text,
  },
  actions: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 12,
  },
  features: {
    marginBottom: 24,
  },
  featuresTitle: {
    ...Typography.h4,
    marginBottom: 12,
  },
  featureItem: {
    ...Typography.body2,
    marginBottom: 8,
    color: Colors.textSecondary,
  },
  disclaimer: {
    backgroundColor: Colors.warning + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.text,
  },
});

export default HomeScreen;
