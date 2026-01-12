# Исправление проблем с Expo SDK 54

## Исправленные проблемы:

1. ✅ **app.json** - убраны неправильные поля:
   - Удалены `minimumOsVersion`, `minSdkVersion`, `compileSdkVersion`, `targetSdkVersion`, `sdkVersion`
   - Сделаны иконки опциональными (убраны обязательные пути)

2. ✅ **package.json** - обновлены версии:
   - `@types/react`: `^18.2.6` → `~19.1.10`
   - `@types/react-test-renderer`: `^18.0.0` → `^19.0.0`
   - `react-test-renderer`: `18.3.1` → `19.1.0`
   - `typescript`: `5.0.4` → `~5.9.2`

3. ✅ **metro.config.js** - обновлен для Expo:
   - Использует `expo/metro-config` вместо `@react-native/metro-config`
   - Сохранена поддержка путей с кириллицей

4. ✅ **.gitignore** - добавлены папки Expo:
   - `.expo/`
   - `.expo-shared/`
   - `dist/`
   - `web-build/`

## Следующие шаги:

### 1. Установите зависимости с --legacy-peer-deps:

```bash
npm install --legacy-peer-deps
```

Эта команда установит зависимости, игнорируя конфликты peer dependencies.

### 2. Обновите Expo зависимости:

```bash
npx expo install --fix --legacy-peer-deps
```

### 3. Проверьте проект:

```bash
npx expo-doctor
```

### 4. Запустите проект:

```bash
npm start
```

## Если все еще есть проблемы:

### Вариант 1: Удалите node_modules и переустановите

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npx expo install --fix --legacy-peer-deps
```

### Вариант 2: Используйте yarn вместо npm

```bash
npm install -g yarn
yarn install
npx expo install --fix
```

## Примечания:

- **React 19** - это новая версия, которая может иметь breaking changes. Если возникнут проблемы, можно временно использовать React 18, но это не рекомендуется для SDK 54.
- **React Native 0.81.5** - новая версия, совместимая с Expo SDK 54 и React 19.
- **--legacy-peer-deps** - временное решение для конфликтов зависимостей. В будущем эти конфликты должны быть решены.

## Проверка работы:

После установки проверьте:
1. `npx expo-doctor` - должно быть меньше ошибок
2. `npm start` - проект должен запуститься
3. Все функции приложения должны работать
