/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирование числа с разделителями тысяч
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Форматирование калорий
 */
export function formatCalories(value: number): string {
  return `${formatNumber(Math.round(value))} ккал`;
}

/**
 * Форматирование веса
 */
export function formatWeight(value: number): string {
  return `${formatNumber(value, 1)} кг`;
}

/**
 * Форматирование роста
 */
export function formatHeight(value: number): string {
  return `${formatNumber(value)} см`;
}

/**
 * Форматирование даты
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('ru-RU', options);
}

/**
 * Форматирование даты и времени
 */
export function formatDateTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('ru-RU', options);
}

/**
 * Форматирование относительного времени (например, "2 дня назад")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'только что';
  } else if (diffMins < 60) {
    return `${diffMins} мин назад`;
  } else if (diffHours < 24) {
    return `${diffHours} ч назад`;
  } else if (diffDays < 7) {
    return `${diffDays} дн назад`;
  } else {
    return formatDate(date);
  }
}

/**
 * Перевод перечисления пола в текст
 */
export function formatGender(gender: 'male' | 'female'): string {
  return gender === 'male' ? 'Мужской' : 'Женский';
}

/**
 * Перевод уровня активности в текст
 */
export function formatActivityLevel(level: string): string {
  const map: Record<string, string> = {
    sedentary: 'Минимальная',
    light: 'Легкая',
    moderate: 'Умеренная',
    very_active: 'Высокая',
    extra_active: 'Экстремальная',
  };
  return map[level] || level;
}

/**
 * Перевод типа формулы в текст
 */
export function formatFormulaType(formula: string): string {
  const map: Record<string, string> = {
    mifflin: 'Mifflin-St Jeor',
    harris: 'Harris-Benedict',
  };
  return map[formula] || formula;
}
