import {
  CalculationInput,
  CalculationResult,
  Interpretation,
  Gender,
  ActivityLevel,
  FormulaType,
  MetabolismCategory,
  ACTIVITY_COEFFICIENTS,
} from '../models';

/**
 * Сервис для выполнения расчетов BMR и TDEE
 */
class CalculationService {
  /**
   * Расчет BMR по формуле Mifflin-St Jeor
   * 
   * Мужчины: BMR = 10 × вес(кг) + 6.25 × рост(см) - 5 × возраст(лет) + 5
   * Женщины: BMR = 10 × вес(кг) + 6.25 × рост(см) - 5 × возраст(лет) - 161
   * 
   * @param input - Входные параметры
   * @returns BMR в ккал/день
   */
  calculateBMRMifflin(input: CalculationInput): number {
    const { weight, height, age, gender } = input;
    
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    
    if (gender === Gender.MALE) {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    
    return Math.round(bmr * 100) / 100; // Округление до 2 знаков
  }

  /**
   * Расчет BMR по формуле Harris-Benedict (пересмотренная версия 1984)
   * 
   * Мужчины: BMR = 88.362 + (13.397 × вес) + (4.799 × рост) - (5.677 × возраст)
   * Женщины: BMR = 447.593 + (9.247 × вес) + (3.098 × рост) - (4.330 × возраст)
   * 
   * @param input - Входные параметры
   * @returns BMR в ккал/день
   */
  calculateBMRHarris(input: CalculationInput): number {
    const { weight, height, age, gender } = input;
    
    let bmr: number;
    
    if (gender === Gender.MALE) {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    return Math.round(bmr * 100) / 100; // Округление до 2 знаков
  }

  /**
   * Расчет BMR по выбранной формуле
   * 
   * @param input - Входные параметры
   * @returns BMR в ккал/день
   */
  calculateBMR(input: CalculationInput): number {
    if (input.formulaType === FormulaType.MIFFLIN) {
      return this.calculateBMRMifflin(input);
    } else {
      return this.calculateBMRHarris(input);
    }
  }

  /**
   * Расчет TDEE (Total Daily Energy Expenditure)
   * TDEE = BMR × коэффициент активности
   * 
   * @param bmr - Базовый метаболизм
   * @param activityLevel - Уровень физической активности
   * @returns TDEE в ккал/день
   */
  calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const coefficient = ACTIVITY_COEFFICIENTS[activityLevel];
    const tdee = bmr * coefficient;
    return Math.round(tdee * 100) / 100; // Округление до 2 знаков
  }

  /**
   * Определение категории метаболизма
   * 
   * @param bmr - Базовый метаболизм
   * @param gender - Пол
   * @returns Категория метаболизма
   */
  determineMetabolismCategory(bmr: number, gender: Gender): MetabolismCategory {
    const lowThreshold = gender === Gender.FEMALE ? 1200 : 1500;
    const highThreshold = gender === Gender.FEMALE ? 2500 : 3000;
    
    if (bmr < lowThreshold) {
      return MetabolismCategory.LOW;
    } else if (bmr > highThreshold) {
      return MetabolismCategory.HIGH;
    } else {
      return MetabolismCategory.NORMAL;
    }
  }

  /**
   * Генерация интерпретации результатов и рекомендаций
   * 
   * @param bmr - Базовый метаболизм
   * @param tdee - Суточная потребность в энергии
   * @param input - Входные параметры
   * @returns Интерпретация результатов
   */
  generateInterpretation(bmr: number, tdee: number, input: CalculationInput): Interpretation {
    const { gender, age } = input;
    const minCalories = gender === Gender.FEMALE ? 1200 : 1500;
    
    // Целевые значения калорийности
    const targetCaloriesMaintain = Math.round(tdee);
    const targetCaloriesLose = Math.max(Math.round(tdee - 500), minCalories);
    const targetCaloriesGain = Math.round(tdee + 500);
    
    // Определение категории
    const category = this.determineMetabolismCategory(bmr, gender);
    
    // Генерация рекомендаций
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    // Базовые рекомендации
    recommendations.push(
      `Ваш базовый метаболизм (BMR): ${Math.round(bmr)} ккал/день`
    );
    recommendations.push(
      `Суточная потребность в энергии (TDEE): ${targetCaloriesMaintain} ккал/день`
    );
    recommendations.push(
      `Для поддержания веса потребляйте около ${targetCaloriesMaintain} ккал в день`
    );
    
    // Рекомендации по целям
    if (targetCaloriesLose > minCalories) {
      recommendations.push(
        `Для снижения веса рекомендуется ${targetCaloriesLose} ккал/день (дефицит 500 ккал)`
      );
    }
    recommendations.push(
      `Для набора веса рекомендуется ${targetCaloriesGain} ккал/день (профицит 500 ккал)`
    );
    
    // Предупреждения и дополнительные рекомендации
    warnings.push(
      `Не опускайтесь ниже ${minCalories} ккал в день без консультации врача`
    );
    
    if (category === MetabolismCategory.LOW) {
      warnings.push(
        'У вас низкий базовый метаболизм. Рекомендуется консультация врача-эндокринолога'
      );
      recommendations.push(
        'Рассмотрите силовые тренировки для увеличения мышечной массы и метаболизма'
      );
    } else if (category === MetabolismCategory.HIGH) {
      recommendations.push(
        'У вас высокий метаболизм. Убедитесь, что получаете достаточно калорий и питательных веществ'
      );
    }
    
    // Рекомендации по возрасту
    if (age >= 50) {
      recommendations.push(
        'С возрастом метаболизм замедляется. Важно сохранять физическую активность и силовые тренировки'
      );
    }
    
    // Рекомендации по активности
    if (input.activityLevel === ActivityLevel.SEDENTARY) {
      recommendations.push(
        'Рекомендуется увеличить физическую активность хотя бы до 150 минут умеренной активности в неделю'
      );
    } else if (input.activityLevel === ActivityLevel.EXTRA_ACTIVE) {
      recommendations.push(
        'При высоком уровне активности важно следить за восстановлением и достаточным потреблением белка'
      );
    }
    
    // Общие рекомендации
    recommendations.push(
      'Распределяйте калории между белками (20-30%), жирами (20-35%) и углеводами (45-65%)'
    );
    recommendations.push(
      'Пейте достаточно воды: минимум 30 мл на 1 кг веса тела'
    );
    
    warnings.push(
      'Данные расчеты носят справочный характер. Для медицинских назначений проконсультируйтесь с врачом'
    );
    
    return {
      category,
      targetCaloriesMaintain,
      targetCaloriesLose,
      targetCaloriesGain,
      recommendations,
      warnings,
    };
  }

  /**
   * Выполнение полного расчета BMR и TDEE с интерпретацией
   * 
   * @param input - Входные параметры
   * @param userId - ID пользователя (опционально)
   * @returns Полный результат расчета
   */
  performCalculation(input: CalculationInput, userId?: string): CalculationResult {
    // Расчет BMR
    const bmr = this.calculateBMR(input);
    
    // Расчет TDEE
    const tdee = this.calculateTDEE(bmr, input.activityLevel);
    
    // Генерация интерпретации
    const interpretation = this.generateInterpretation(bmr, tdee, input);
    
    // Формирование результата
    const result: CalculationResult = {
      userId,
      bmr,
      tdee,
      input,
      interpretation,
      createdAt: new Date(),
    };
    
    return result;
  }

  /**
   * Расчет ИМТ (Индекс Массы Тела) для дополнительной информации
   * ИМТ = вес(кг) / (рост(м))²
   * 
   * @param weight - Вес в кг
   * @param height - Рост в см
   * @returns ИМТ
   */
  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  }

  /**
   * Интерпретация ИМТ
   * 
   * @param bmi - Индекс массы тела
   * @returns Категория ИМТ
   */
  interpretBMI(bmi: number): string {
    if (bmi < 16) {
      return 'Выраженный дефицит массы тела';
    } else if (bmi < 18.5) {
      return 'Недостаточная масса тела';
    } else if (bmi < 25) {
      return 'Нормальная масса тела';
    } else if (bmi < 30) {
      return 'Избыточная масса тела (предожирение)';
    } else if (bmi < 35) {
      return 'Ожирение I степени';
    } else if (bmi < 40) {
      return 'Ожирение II степени';
    } else {
      return 'Ожирение III степени (морбидное)';
    }
  }
}

// Экспорт singleton instance
export default new CalculationService();
