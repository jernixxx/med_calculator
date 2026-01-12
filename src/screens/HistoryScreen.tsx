import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Button, Card, HistoryItem } from '../components';
import { Colors, Typography, CommonStyles } from '../styles';
import { CalculationResult } from '../models';
import { DatabaseService } from '../services';

interface HistoryScreenProps {
  navigation: any;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      await DatabaseService.initDatabase();
      const data = await DatabaseService.getCalculations();
      setCalculations(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleItemPress = (calculation: CalculationResult) => {
    navigation.navigate('Result', { calculation });
  };

  const handleNewCalculation = () => {
    navigation.navigate('Calculation');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Загрузка истории...</Text>
      </View>
    );
  }

  if (calculations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, styles.center]}>
          <Text style={styles.emptyTitle}>История пуста</Text>
          <Text style={styles.emptySubtitle}>
            Выполните первый расчет, чтобы увидеть его здесь
          </Text>
          <Button
            title="Новый расчет"
            onPress={handleNewCalculation}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>История расчетов</Text>
        <Text style={styles.subtitle}>Всего: {calculations.length}</Text>
      </View>

      <FlatList
        data={calculations}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <HistoryItem
            calculation={item}
            onPress={() => handleItemPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    ...Typography.h2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  loadingText: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...Typography.body2,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});

export default HistoryScreen;
