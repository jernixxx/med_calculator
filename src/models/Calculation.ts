import { Gender, ActivityLevel, FormulaType, MetabolismCategory } from './Enums';

// Входные параметры для расчета
export interface CalculationInput {
  weight: number;           // кг (30-300)
  height: number;           // см (100-250)
  age: number;              // лет (18-100)
  gender: Gender;
  activityLevel: ActivityLevel;
  formulaType: FormulaType;
}

// Интерпретация результатов
export interface Interpretation {
  category: MetabolismCategory;
  targetCaloriesMaintain: number;   // Для поддержания веса
  targetCaloriesLose: number;       // Для снижения веса (-500 ккал)
  targetCaloriesGain: number;       // Для набора веса (+500 ккал)
  recommendations: string[];        // Рекомендации
  warnings: string[];               // Предупреждения
}

// Результат расчета
export interface CalculationResult {
  id?: number;              // ID в БД (если сохранено)
  userId?: string;          // ID пользователя
  bmr: number;              // Базовый метаболизм (ккал/день)
  tdee: number;             // Суточная потребность (ккал/день)
  input: CalculationInput;  // Исходные параметры
  interpretation: Interpretation;
  createdAt: Date;
}

// DTO для базы данных
export interface CalculationDTO {
  id?: number;
  user_id?: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity_level: string;
  formula_type: string;
  bmr: number;
  tdee: number;
  created_at: number;
}

// Преобразование из DTO в модель
export function calculationFromDTO(dto: CalculationDTO): CalculationResult {
  const input: CalculationInput = {
    weight: dto.weight,
    height: dto.height,
    age: dto.age,
    gender: dto.gender as Gender,
    activityLevel: dto.activity_level as ActivityLevel,
    formulaType: dto.formula_type as FormulaType,
  };

  // Базовая генерация интерпретации
  const interpretation = generateBasicInterpretation(dto.bmr, dto.tdee, input.gender);

  return {
    id: dto.id,
    userId: dto.user_id,
    bmr: dto.bmr,
    tdee: dto.tdee,
    input,
    interpretation,
    createdAt: new Date(dto.created_at * 1000),
  };
}

// Преобразование из модели в DTO
export function calculationToDTO(calc: CalculationResult): CalculationDTO {
  return {
    id: calc.id,
    user_id: calc.userId,
    weight: calc.input.weight,
    height: calc.input.height,
    age: calc.input.age,
    gender: calc.input.gender,
    activity_level: calc.input.activityLevel,
    formula_type: calc.input.formulaType,
    bmr: calc.bmr,
    tdee: calc.tdee,
    created_at: Math.floor(calc.createdAt.getTime() / 1000),
  };
}

// Базовая генерация интерпретации
function generateBasicInterpretation(
  bmr: number,
  tdee: number,
  gender: Gender
): Interpretation {
  const minCalories = gender === Gender.FEMALE ? 1200 : 1500;
  const targetCaloriesLose = Math.max(tdee - 500, minCalories);
  const targetCaloriesGain = tdee + 500;

  let category: MetabolismCategory;
  if (bmr < (gender === Gender.FEMALE ? 1200 : 1500)) {
    category = MetabolismCategory.LOW;
  } else if (bmr > (gender === Gender.FEMALE ? 2500 : 3000)) {
    category = MetabolismCategory.HIGH;
  } else {
    category = MetabolismCategory.NORMAL;
  }

  return {
    category,
    targetCaloriesMaintain: Math.round(tdee),
    targetCaloriesLose: Math.round(targetCaloriesLose),
    targetCaloriesGain: Math.round(targetCaloriesGain),
    recommendations: [],
    warnings: [],
  };
}
