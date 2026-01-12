/**
 * Константы приложения
 */

// Ограничения ввода
export const INPUT_LIMITS = {
  weight: {
    min: 30,
    max: 300,
    step: 0.1,
  },
  height: {
    min: 100,
    max: 250,
    step: 1,
  },
  age: {
    min: 18,
    max: 100,
    step: 1,
  },
};

// Минимальные калории
export const MIN_CALORIES = {
  male: 1500,
  female: 1200,
};

// Значения по умолчанию
export const DEFAULT_VALUES = {
  weight: 70,
  height: 170,
  age: 30,
  gender: 'male' as const,
  activityLevel: 'moderate' as const,
  formulaType: 'mifflin' as const,
};

// Количество записей для пагинации
export const PAGINATION = {
  historyPageSize: 20,
  maxHistoryItems: 100,
};

// Таймауты
export const TIMEOUTS = {
  splashScreen: 2000,
  debounceInput: 300,
  toastDuration: 3000,
};

// Версия приложения
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'BMR/TDEE Калькулятор';

// Ссылки на источники
export const SOURCES = {
  mifflin: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
  harris: 'https://pubmed.ncbi.nlm.nih.gov/6741850/',
  who: 'https://www.who.int/publications/i/item/9241208945',
};
