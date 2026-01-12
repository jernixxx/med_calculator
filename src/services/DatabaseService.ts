import {
  CalculationResult,
  CalculationDTO,
  calculationFromDTO,
  calculationToDTO,
} from '../models';
import * as SQLite from 'expo-sqlite';

/**
 * Сервис для работы с локальной базой данных SQLite
 * Использует expo-sqlite для работы с базой данных
 */
class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  /**
   * Получение singleton instance
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Инициализация базы данных
   * Создает таблицы и индексы при первом запуске
   */
  async initDatabase(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('[DatabaseService] Initializing database...');
      
      // Открываем базу данных через expo-sqlite
      this.db = await SQLite.openDatabaseAsync('BMRTDEECalculator.db');

      // Создание таблиц
      await this.createTables();
      
      this.isInitialized = true;
      console.log('[DatabaseService] Database initialized successfully');
    } catch (error) {
      console.error('[DatabaseService] Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  /**
   * Создание таблиц базы данных
   */
  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const createCalculationsTable = `
      CREATE TABLE IF NOT EXISTS calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        weight REAL NOT NULL,
        height REAL NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
        activity_level TEXT NOT NULL CHECK(activity_level IN ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')),
        formula_type TEXT NOT NULL CHECK(formula_type IN ('mifflin', 'harris')),
        bmr REAL NOT NULL,
        tdee REAL NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s','now'))
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON calculations(user_id);
      CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(created_at DESC);
    `;

    await this.db.execAsync(createCalculationsTable);
    await this.db.execAsync(createIndexes);
    
    console.log('[DatabaseService] Tables created');
  }

  /**
   * Сохранение расчета в базу данных
   * 
   * @param calculation - Результат расчета
   * @returns ID сохраненной записи
   */
  async saveCalculation(calculation: CalculationResult): Promise<number> {
    await this.ensureInitialized();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const dto = calculationToDTO(calculation);
      
      const result = await this.db.runAsync(
        `INSERT INTO calculations (
          user_id, weight, height, age, gender, 
          activity_level, formula_type, bmr, tdee, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dto.user_id || null,
          dto.weight,
          dto.height,
          dto.age,
          dto.gender,
          dto.activity_level,
          dto.formula_type,
          dto.bmr,
          dto.tdee,
          dto.created_at,
        ]
      );
      
      console.log('[DatabaseService] Calculation saved with ID:', result.lastInsertRowId);
      return result.lastInsertRowId;
    } catch (error) {
      console.error('[DatabaseService] Error saving calculation:', error);
      throw new Error('Failed to save calculation');
    }
  }

  /**
   * Получение всех расчетов
   * 
   * @param userId - ID пользователя (опционально)
   * @param limit - Максимальное количество записей
   * @returns Массив расчетов
   */
  async getCalculations(userId?: string, limit: number = 100): Promise<CalculationResult[]> {
    await this.ensureInitialized();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      let query = 'SELECT * FROM calculations';
      const params: any[] = [];

      if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
      }

      query += ' ORDER BY created_at DESC LIMIT ?';
      params.push(limit);

      const result = await this.db.getAllAsync(query, params);
      return result.map((row: any) => calculationFromDTO(row as CalculationDTO));
    } catch (error) {
      console.error('[DatabaseService] Error getting calculations:', error);
      return [];
    }
  }

  /**
   * Получение расчета по ID
   * 
   * @param id - ID расчета
   * @returns Расчет или null
   */
  async getCalculationById(id: number): Promise<CalculationResult | null> {
    await this.ensureInitialized();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await this.db.getFirstAsync<CalculationDTO>(
        'SELECT * FROM calculations WHERE id = ?',
        [id]
      );
      
      if (result) {
        return calculationFromDTO(result);
      }
      return null;
    } catch (error) {
      console.error('[DatabaseService] Error getting calculation by ID:', error);
      return null;
    }
  }

  /**
   * Удаление расчета по ID
   * 
   * @param id - ID расчета
   */
  async deleteCalculation(id: number): Promise<void> {
    await this.ensureInitialized();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      await this.db.runAsync('DELETE FROM calculations WHERE id = ?', [id]);
      console.log('[DatabaseService] Calculation deleted:', id);
    } catch (error) {
      console.error('[DatabaseService] Error deleting calculation:', error);
      throw new Error('Failed to delete calculation');
    }
  }

  /**
   * Очистка всей истории расчетов
   * 
   * @param userId - ID пользователя (опционально, удалит только его записи)
   */
  async clearHistory(userId?: string): Promise<void> {
    await this.ensureInitialized();

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      if (userId) {
        await this.db.runAsync('DELETE FROM calculations WHERE user_id = ?', [userId]);
      } else {
        await this.db.runAsync('DELETE FROM calculations');
      }
      
      console.log('[DatabaseService] History cleared');
    } catch (error) {
      console.error('[DatabaseService] Error clearing history:', error);
      throw new Error('Failed to clear history');
    }
  }

  /**
   * Получение статистики по расчетам
   * 
   * @param userId - ID пользователя
   * @returns Статистика
   */
  async getStatistics(userId?: string): Promise<{
    totalCalculations: number;
    avgBMR: number;
    avgTDEE: number;
    latestCalculation?: CalculationResult;
  }> {
    await this.ensureInitialized();

    try {
      const calculations = await this.getCalculations(userId);
      
      if (calculations.length === 0) {
        return {
          totalCalculations: 0,
          avgBMR: 0,
          avgTDEE: 0,
        };
      }

      const avgBMR = calculations.reduce((sum, c) => sum + c.bmr, 0) / calculations.length;
      const avgTDEE = calculations.reduce((sum, c) => sum + c.tdee, 0) / calculations.length;

      return {
        totalCalculations: calculations.length,
        avgBMR: Math.round(avgBMR),
        avgTDEE: Math.round(avgTDEE),
        latestCalculation: calculations[0],
      };
    } catch (error) {
      console.error('[DatabaseService] Error getting statistics:', error);
      return {
        totalCalculations: 0,
        avgBMR: 0,
        avgTDEE: 0,
      };
    }
  }

  /**
   * Закрытие соединения с базой данных
   */
  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
      console.log('[DatabaseService] Database closed');
    }
  }

  /**
   * Проверка инициализации БД
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initDatabase();
    }
  }

}

// Экспорт singleton instance
export default DatabaseService.getInstance();
