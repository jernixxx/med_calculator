export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface InputConstraints {
  weight: { min: number; max: number };
  height: { min: number; max: number };
  age: { min: number; max: number };
}

export const DEFAULT_CONSTRAINTS: InputConstraints = {
  weight: { min: 30, max: 300 },
  height: { min: 100, max: 250 },
  age: { min: 18, max: 100 },
};
