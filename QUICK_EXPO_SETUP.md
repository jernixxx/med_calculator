# БЫСТРАЯ МИГРАЦИЯ НА EXPO

## Почему Expo?
- ✅ Нет проблем с нативными библиотеками
- ✅ Простая сборка APK через `eas build`
- ✅ Все ваши библиотеки поддерживаются
- ✅ SQLite еще не реализован - легко мигрировать

## Быстрая установка (5 минут)

### Шаг 1: Установите Expo CLI
```bash
npm install -g @expo/cli eas-cli
```

### Шаг 2: Добавьте Expo в проект
```bash
npx expo install expo expo-sqlite
```

### Шаг 3: Обновите app.json
Создайте/обновите `app.json`:

```json
{
  "expo": {
    "name": "BMR TDEE Калькулятор",
    "slug": "bmr-tdee-calculator",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.bmrtdeecalculator",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "plugins": [
      "expo-sqlite"
    ]
  }
}
```

### Шаг 4: Обновите DatabaseService.ts
Замените заглушки на реальный код с Expo SQLite:

```typescript
// В начале файла:
import * as SQLite from 'expo-sqlite';

// В методе initDatabase():
async initDatabase(): Promise<void> {
  if (this.isInitialized) {
    return;
  }

  try {
    console.log('[DatabaseService] Initializing database...');
    
    // Открываем базу данных
    this.db = await SQLite.openDatabaseAsync('BMRTDEECalculator.db');
    
    // Создаем таблицы
    await this.createTables();
    
    this.isInitialized = true;
    console.log('[DatabaseService] Database initialized successfully');
  } catch (error) {
    console.error('[DatabaseService] Error initializing database:', error);
    throw new Error('Failed to initialize database');
  }
}

// В методе createTables():
private async createTables(): Promise<void> {
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

// В методе saveCalculation():
async saveCalculation(calculation: CalculationResult): Promise<number> {
  await this.ensureInitialized();

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
    
    return result.lastInsertRowId;
  } catch (error) {
    console.error('[DatabaseService] Error saving calculation:', error);
    throw new Error('Failed to save calculation');
  }
}

// В методе getCalculations():
async getCalculations(userId?: string, limit: number = 100): Promise<CalculationResult[]> {
  await this.ensureInitialized();

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
```

### Шаг 5: Соберите APK через EAS Build

```bash
# Войдите в Expo (создайте бесплатный аккаунт)
eas login

# Настройте проект
eas build:configure

# Соберите APK (бесплатно!)
eas build --platform android --profile preview
```

APK будет готов через 10-15 минут и доступен для скачивания!

## Альтернатива: Локальная сборка

Если хотите собрать локально (требует Android Studio):

```bash
npx expo prebuild
cd android
.\gradlew assembleDebug
```

## Преимущества Expo

1. **Нет проблем с нативными библиотеками** - Expo управляет всем автоматически
2. **Простая сборка** - `eas build` вместо настройки Gradle
3. **Бесплатно** - EAS Build дает бесплатные сборки
4. **Обновления OTA** - можно обновлять приложение без пересборки

## Что дальше?

После миграции:
1. Удалите `android/` и `ios/` папки (Expo создаст их заново при необходимости)
2. Обновите `.gitignore` - добавьте `android/` и `ios/`
3. Используйте `npx expo start` вместо `npm start`

## Нужна помощь?

Смотрите полную инструкцию в `docs/EXPO_MIGRATION.md`
