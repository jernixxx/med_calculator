# Исправление ошибки "Property 'require' doesn't exist"

## Проблема

Ошибка `ReferenceError: Property 'require' doesn't exist` возникает из-за неправильной конфигурации entry point для Expo.

## Исправления

### 1. ✅ Исправлен `index.js`

**Было (старый формат React Native):**
```javascript
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

**Стало (формат Expo):**
```javascript
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
```

### 2. ✅ Исправлен `babel.config.js`

**Было:**
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
```

**Стало:**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

### 3. ✅ Добавлен `babel-preset-expo` в `package.json`

## Следующие шаги

### 1. Установите зависимости:

```bash
npm install
```

### 2. Очистите кэш и перезапустите:

```bash
npx expo start -c
```

Флаг `-c` очистит кэш Metro bundler.

### 3. Перезапустите приложение на устройстве

Если приложение уже запущено, закройте его полностью и откройте снова.

## Объяснение

Проблема была в том, что:
- `index.js` использовал старый формат React Native с `AppRegistry`
- `babel.config.js` использовал `@react-native/babel-preset` вместо `babel-preset-expo`
- Expo требует специальный entry point через `registerRootComponent`

Теперь все настроено правильно для Expo SDK 54!
