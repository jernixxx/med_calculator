/**
 * Маршруты приложения
 */
export const Routes = {
  HOME: 'Home',
  CALCULATION: 'Calculation',
  RESULT: 'Result',
  HISTORY: 'History',
} as const;

export type RouteNames = typeof Routes[keyof typeof Routes];
