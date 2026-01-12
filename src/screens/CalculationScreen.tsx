import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, InputField, Card } from '../components';
import { Colors, Typography, CommonStyles } from '../styles';
import {
  Gender,
  ActivityLevel,
  FormulaType,
  CalculationInput,
} from '../models';
import { CalculationService, ValidationService, DatabaseService } from '../services';
import { DEFAULT_VALUES } from '../utils';

interface CalculationScreenProps {
  navigation: any;
}

export const CalculationScreen: React.FC<CalculationScreenProps> = ({ navigation }) => {
  const [weight, setWeight] = useState(DEFAULT_VALUES.weight.toString());
  const [height, setHeight] = useState(DEFAULT_VALUES.height.toString());
  const [age, setAge] = useState(DEFAULT_VALUES.age.toString());
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(ActivityLevel.MODERATE);
  const [formulaType, setFormulaType] = useState<FormulaType>(FormulaType.MIFFLIN);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    try {
      setLoading(true);

      // Подготовка входных данных
      const input: CalculationInput = {
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age, 10),
        gender,
        activityLevel,
        formulaType,
      };

      // Валидация
      const validation = ValidationService.validateAllInputs(input);
      if (!validation.isValid) {
        const errorMessage = ValidationService.formatErrors(validation);
        Alert.alert('Ошибка валидации', errorMessage);
        return;
      }

      // Выполнение расчета
      const result = CalculationService.performCalculation(input);

      // Сохранение в БД
      await DatabaseService.initDatabase();
      const savedId = await DatabaseService.saveCalculation(result);
      
      // Переход к результатам
      navigation.navigate('Result', { calculation: { ...result, id: savedId } });
    } catch (error) {
      console.error('Calculation error:', error);
      Alert.alert('Ошибка', 'Не удалось выполнить расчет. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Параметры для расчета</Text>

        <Card>
          <InputField
            label="Вес (кг)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholder="70.0"
          />

          <InputField
            label="Рост (см)"
            value={height}
            onChangeText={setHeight}
            keyboardType="number-pad"
            placeholder="170"
          />

          <InputField
            label="Возраст (лет)"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="30"
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Пол</Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Мужской"
              onPress={() => setGender(Gender.MALE)}
              variant={gender === Gender.MALE ? 'primary' : 'outline'}
              style={styles.halfButton}
            />
            <Button
              title="Женский"
              onPress={() => setGender(Gender.FEMALE)}
              variant={gender === Gender.FEMALE ? 'primary' : 'outline'}
              style={styles.halfButton}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Уровень активности</Text>
          {Object.values(ActivityLevel).map((level) => (
            <Button
              key={level}
              title={getActivityLevelLabel(level)}
              onPress={() => setActivityLevel(level)}
              variant={activityLevel === level ? 'primary' : 'outline'}
              style={styles.activityButton}
            />
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Формула расчета</Text>
          <Button
            title="Mifflin-St Jeor (рекомендуемая)"
            onPress={() => setFormulaType(FormulaType.MIFFLIN)}
            variant={formulaType === FormulaType.MIFFLIN ? 'primary' : 'outline'}
            style={styles.activityButton}
          />
          <Button
            title="Harris-Benedict (классическая)"
            onPress={() => setFormulaType(FormulaType.HARRIS)}
            variant={formulaType === FormulaType.HARRIS ? 'primary' : 'outline'}
            style={styles.activityButton}
          />
        </Card>

        <Button
          title="Рассчитать"
          onPress={handleCalculate}
          loading={loading}
          style={styles.calculateButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

function getActivityLevelLabel(level: ActivityLevel): string {
  const labels: Record<ActivityLevel, string> = {
    [ActivityLevel.SEDENTARY]: 'Минимальная (1.2)',
    [ActivityLevel.LIGHT]: 'Легкая (1.375)',
    [ActivityLevel.MODERATE]: 'Умеренная (1.55)',
    [ActivityLevel.VERY_ACTIVE]: 'Высокая (1.725)',
    [ActivityLevel.EXTRA_ACTIVE]: 'Экстремальная (1.9)',
  };
  return labels[level];
}

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
    ...Typography.h4,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activityButton: {
    marginBottom: 8,
  },
  calculateButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});

export default CalculationScreen;
