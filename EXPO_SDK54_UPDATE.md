# Обновление до Expo SDK 54

## Что было сделано:

1. ✅ Обновлен `package.json`:
   - `expo`: `~52.0.48` → `~54.0.0`
   - `expo-sqlite`: `~15.1.4` → `~16.0.0`

2. ✅ Обновлен `app.json`:
   - Добавлены требования SDK 54:
     - iOS: `minimumOsVersion: "15.1"`
     - Android: `compileSdkVersion: 36`, `targetSdkVersion: 36`
   - Добавлен `sdkVersion: "54.0.0"`

## Следующие шаги:

### 1. Установите обновленные зависимости:

```bash
npm install
```

### 2. Автоматически обновите все зависимости до совместимых версий:

```bash
npx expo install --fix
```

Эта команда автоматически обновит все Expo-зависимости до версий, совместимых с SDK 54.

### 3. Проверьте совместимость других зависимостей:

```bash
npx expo-doctor
```

Эта команда проверит, нет ли проблем с зависимостями.

### 4. Очистите кэш и перезапустите:

```bash
npx expo start -c
```

## Важные изменения в SDK 54:

- **Минимальная версия iOS**: 15.1
- **Android compileSdkVersion**: 36
- **Android targetSdkVersion**: 36
- **React Native**: 0.76.6 (совместим)

## Проверка работы:

После обновления проверьте:
1. Запуск приложения: `npm start`
2. Работу базы данных SQLite
3. Все функции приложения

## Если возникнут проблемы:

1. Удалите `node_modules` и `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Очистите кэш Expo:
   ```bash
   npx expo start -c
   ```

3. Проверьте логи на наличие ошибок совместимости

## Дополнительная информация:

- [Expo SDK 54 Release Notes](https://docs.expo.dev/versions/v54.0.0/)
- [Upgrading Expo SDK](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
