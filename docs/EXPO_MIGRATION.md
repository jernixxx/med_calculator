# МИГРАЦИЯ НА EXPO

## Почему Expo?

Expo решает проблемы с нативными библиотеками:
- ✅ Автоматическое управление нативными зависимостями
- ✅ Простая сборка APK через EAS Build или `expo build`
- ✅ Меньше проблем с компиляцией и упаковкой
- ✅ Все ваши библиотеки поддерживаются в Expo

## Вариант 1: Добавление Expo в существующий проект (рекомендуется)

Этот вариант позволяет сохранить существующий код и постепенно мигрировать.

### Шаг 1: Установка Expo CLI

```bash
npm install -g expo-cli
# или
npm install -g @expo/cli
```

### Шаг 2: Инициализация Expo в проекте

```bash
npx expo install expo
npx expo install expo-sqlite
```

### Шаг 3: Обновление app.json

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
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.bmrtdeecalculator"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.bmrtdeecalculator"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-sqlite"
    ]
  }
}
```

### Шаг 4: Замена react-native-sqlite-storage на expo-sqlite

В вашем коде замените:

```typescript
// Было:
import SQLite from 'react-native-sqlite-storage';

// Стало:
import * as SQLite from 'expo-sqlite';
```

### Шаг 5: Обновление зависимостей

```bash
npx expo install react-native-svg react-native-screens react-native-safe-area-context
```

### Шаг 6: Сборка APK

```bash
# Установите EAS CLI
npm install -g eas-cli

# Войдите в аккаунт Expo (или создайте новый)
eas login

# Настройте проект
eas build:configure

# Соберите APK
eas build --platform android --profile preview
```

## Вариант 2: Создание нового проекта через Expo (быстрее)

Если хотите начать с чистого листа:

### Шаг 1: Создание нового проекта

```bash
npx create-expo-app BMRTDEECalculator --template blank-typescript
cd BMRTDEECalculator
```

### Шаг 2: Установка зависимостей

```bash
npx expo install expo-sqlite react-native-svg react-native-chart-kit @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

### Шаг 3: Перенос кода

Скопируйте из старого проекта:
- `src/` - весь исходный код
- `assets/` - изображения и ресурсы
- Обновите импорты SQLite на `expo-sqlite`

### Шаг 4: Настройка app.json

Создайте `app.json` как в Варианте 1.

### Шаг 5: Сборка APK

```bash
eas build --platform android --profile preview
```

## Сравнение библиотек

| Старая библиотека | Expo эквивалент |
|-------------------|-----------------|
| `react-native-sqlite-storage` | `expo-sqlite` |
| `react-native-svg` | ✅ Работает как есть |
| `react-native-chart-kit` | ✅ Работает как есть |
| `@react-navigation/*` | ✅ Работает как есть |

## Преимущества Expo

1. **Простая сборка**: `eas build` вместо настройки Gradle
2. **Автоматические обновления**: OTA updates через Expo Updates
3. **Меньше проблем**: Expo управляет нативными зависимостями
4. **Кроссплатформенность**: Один код для Android и iOS
5. **Бесплатный хостинг**: Expo Go для тестирования

## Недостатки Expo

1. **Размер APK**: Чуть больше из-за Expo runtime
2. **Ограничения**: Некоторые нативные модули требуют EAS Build
3. **Интернет**: Для некоторых функций нужен интернет (но ваше приложение работает оффлайн)

## Рекомендация

**Используйте Вариант 1** - добавление Expo в существующий проект. Это позволит:
- Сохранить весь существующий код
- Постепенно мигрировать
- Использовать Expo для сборки, но сохранить гибкость

## Быстрый старт (Вариант 1)

```bash
# 1. Установите Expo
npm install -g @expo/cli

# 2. Добавьте Expo в проект
npx expo install expo expo-sqlite

# 3. Обновите app.json (см. выше)

# 4. Замените SQLite импорты в коде

# 5. Соберите APK
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

APK будет доступен для скачивания через несколько минут!
