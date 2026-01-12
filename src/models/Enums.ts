// Пол пользователя
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

// Уровень физической активности
export enum ActivityLevel {
  SEDENTARY = 'sedentary',        // 1.2
  LIGHT = 'light',                // 1.375
  MODERATE = 'moderate',          // 1.55
  VERY_ACTIVE = 'very_active',    // 1.725
  EXTRA_ACTIVE = 'extra_active',  // 1.9
}

// Тип формулы расчета BMR
export enum FormulaType {
  MIFFLIN = 'mifflin',
  HARRIS = 'harris',
}

// Роль пользователя
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

// Категория метаболизма
export enum MetabolismCategory {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

// Коэффициенты активности
export const ACTIVITY_COEFFICIENTS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.2,
  [ActivityLevel.LIGHT]: 1.375,
  [ActivityLevel.MODERATE]: 1.55,
  [ActivityLevel.VERY_ACTIVE]: 1.725,
  [ActivityLevel.EXTRA_ACTIVE]: 1.9,
};

// Описания уровней активности
export const ACTIVITY_DESCRIPTIONS: Record<ActivityLevel, string> = {
  [ActivityLevel.SEDENTARY]: 'Минимальная активность, сидячий образ жизни',
  [ActivityLevel.LIGHT]: 'Легкие упражнения 1-3 раза в неделю',
  [ActivityLevel.MODERATE]: 'Умеренные упражнения 3-5 раз в неделю',
  [ActivityLevel.VERY_ACTIVE]: 'Интенсивные тренировки 6-7 раз в неделю',
  [ActivityLevel.EXTRA_ACTIVE]: 'Ежедневные интенсивные тренировки + физическая работа',
};

// Описания формул
export const FORMULA_DESCRIPTIONS: Record<FormulaType, string> = {
  [FormulaType.MIFFLIN]: 'Mifflin-St Jeor (рекомендуемая, современная)',
  [FormulaType.HARRIS]: 'Harris-Benedict (классическая)',
};
