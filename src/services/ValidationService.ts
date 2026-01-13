import {
  ValidationResult,
  ValidationError,
  CalculationInput,
  DEFAULT_CONSTRAINTS,
} from '../models';

/**
 * Сервис для валидации входных данных
 */
class ValidationService {
  /**
   * Валидация веса
   */
  validateWeight(weight: number): ValidationResult {
    const errors: ValidationError[] = [];
    const { min, max } = DEFAULT_CONSTRAINTS.weight;

    if (isNaN(weight)) {
      errors.push({
        field: 'weight',
        message: 'Вес должен быть числом',
        severity: 'error',
      });
    } else if (weight < min) {
      errors.push({
        field: 'weight',
        message: `Вес не может быть меньше ${min} кг`,
        severity: 'error',
      });
    } else if (weight > max) {
      errors.push({
        field: 'weight',
        message: `Вес не может быть больше ${max} кг`,
        severity: 'error',
      });
    } else if (weight < 40 || weight > 200) {
      errors.push({
        field: 'weight',
        message: 'Экстремальное значение веса. Проверьте правильность ввода',
        severity: 'warning',
      });
    }

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Валидация роста
   */
  validateHeight(height: number): ValidationResult {
    const errors: ValidationError[] = [];
    const { min, max } = DEFAULT_CONSTRAINTS.height;

    if (isNaN(height)) {
      errors.push({
        field: 'height',
        message: 'Рост должен быть числом',
        severity: 'error',
      });
    } else if (height < min) {
      errors.push({
        field: 'height',
        message: `Рост не может быть меньше ${min} см`,
        severity: 'error',
      });
    } else if (height > max) {
      errors.push({
        field: 'height',
        message: `Рост не может быть больше ${max} см`,
        severity: 'error',
      });
    } else if (height < 140 || height > 220) {
      errors.push({
        field: 'height',
        message: 'Экстремальное значение роста. Проверьте правильность ввода',
        severity: 'warning',
      });
    }

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Валидация возраста
   */
  validateAge(age: number): ValidationResult {
    const errors: ValidationError[] = [];
    const { min, max } = DEFAULT_CONSTRAINTS.age;

    if (isNaN(age) || !Number.isInteger(age)) {
      errors.push({
        field: 'age',
        message: 'Возраст должен быть целым числом',
        severity: 'error',
      });
    } else if (age < min) {
      errors.push({
        field: 'age',
        message: `Возраст не может быть меньше ${min} лет`,
        severity: 'error',
      });
    } else if (age > max) {
      errors.push({
        field: 'age',
        message: `Возраст не может быть больше ${max} лет`,
        severity: 'error',
      });
    } else if (age >= 70) {
      errors.push({
        field: 'age',
        message: 'Для пожилых людей рекомендуется консультация врача',
        severity: 'warning',
      });
    }

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Валидация всех входных данных
   */
  validateAllInputs(input: CalculationInput): ValidationResult {
    const allErrors: ValidationError[] = [];

    // Валидация каждого поля
    const weightResult = this.validateWeight(input.weight);
    const heightResult = this.validateHeight(input.height);
    const ageResult = this.validateAge(input.age);

    allErrors.push(...weightResult.errors);
    allErrors.push(...heightResult.errors);
    allErrors.push(...ageResult.errors);

    // Проверка ИМТ
    const bmi = input.weight / Math.pow(input.height / 100, 2);
    if (bmi < 16) {
      allErrors.push({
        field: 'bmi',
        message: 'Критически низкий ИМТ. Рекомендуется консультация врача',
        severity: 'warning',
      });
    } else if (bmi > 40) {
      allErrors.push({
        field: 'bmi',
        message: 'Критически высокий ИМТ. Рекомендуется консультация врача',
        severity: 'warning',
      });
    }

    return {
      isValid: allErrors.filter(e => e.severity === 'error').length === 0,
      errors: allErrors,
    };
  }

  /**
   * Форматирование сообщений об ошибках для отображения
   */
  formatErrors(validationResult: ValidationResult): string {
    if (validationResult.isValid && validationResult.errors.length === 0) {
      return '';
    }

    const errorMessages = validationResult.errors
      .filter(e => e.severity === 'error')
      .map(e => e.message);
    
    const warningMessages = validationResult.errors
      .filter(e => e.severity === 'warning')
      .map(e => e.message);

    let result = '';
    
    if (errorMessages.length > 0) {
      result += 'Ошибки:\n' + errorMessages.join('\n');
    }
    
    if (warningMessages.length > 0) {
      if (result) result += '\n\n';
      result += 'Предупреждения:\n' + warningMessages.join('\n');
    }

    return result;
  }
}

export default new ValidationService();
