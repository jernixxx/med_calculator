# ИНСТРУКЦИЯ ПО СБОРКЕ APK

> **⚠️ ВАЖНО:** Если у вас проблемы с нативными библиотеками (libjscexecutor.so, libhermes_executor.so), рекомендуется мигрировать на Expo. См. `QUICK_EXPO_SETUP.md` для быстрой миграции или `docs/EXPO_MIGRATION.md` для подробной инструкции.

## Альтернатива: Миграция на Expo

Expo решает проблемы с нативными библиотеками и упрощает сборку:
- ✅ Автоматическое управление нативными зависимостями
- ✅ Простая сборка через `eas build`
- ✅ Все ваши библиотеки поддерживаются

**Быстрый старт:** См. `QUICK_EXPO_SETUP.md`

---

# ИНСТРУКЦИЯ ПО СБОРКЕ APK (React Native без Expo)

## Предварительные требования

### 1. Установка Node.js и npm
- Скачайте и установите Node.js (версия 18 или выше) с официального сайта: https://nodejs.org/
- Проверьте установку:
```bash
node --version
npm --version
```

### 2. Установка Java Development Kit (JDK)
- Установите JDK 17:
  - Windows: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
  - Или используйте OpenJDK
- Настройте переменную окружения `JAVA_HOME`

### 3. Установка Android SDK
- Скачайте Android Studio: https://developer.android.com/studio
- Установите Android SDK через Android Studio (SDK Manager)
- Настройте переменные окружения:
  - `ANDROID_HOME` = путь к Android SDK
  - Добавьте в PATH: `%ANDROID_HOME%\platform-tools` и `%ANDROID_HOME%\tools`

## Установка зависимостей

1. Перейдите в директорию проекта:
```bash
cd "C:\Users\lelis\OneDrive\Рабочий стол\курсовая"
```

2. Установите npm пакеты:
```bash
npm install
```

**Примечание:** Если при запуске `npm start` появляется предупреждение о `@react-native-community/cli`, убедитесь, что этот пакет добавлен в `devDependencies` в `package.json` и выполните `npm install` снова.

3. Для Windows может потребоваться установка дополнительных инструментов:
```bash
npm install -g windows-build-tools
```

## Сборка APK

### Вариант 1: Debug APK (для тестирования)

```bash
cd android
gradlew assembleDebug
```

Файл будет находиться в: `android\app\build\outputs\apk\debug\app-debug.apk`

### Вариант 2: Release APK (для публикации)

```bash
cd android
gradlew assembleRelease
```

Файл будет находиться в: `android\app\build\outputs\apk\release\app-release.apk`

## Установка APK на устройство

### Проверка подключенных устройств

Перед установкой проверьте, что устройство подключено:

```bash
adb devices
```

Должен появиться список подключенных устройств. Если список пуст:
1. Убедитесь, что устройство подключено по USB
2. Включите "Режим разработчика" на Android устройстве
3. Включите "Отладка по USB"
4. Разрешите отладку по USB на устройстве (появится запрос)

### Через USB (автоматическая установка):
1. Включите "Режим разработчика" на Android устройстве
2. Включите "Отладка по USB"
3. Подключите устройство к компьютеру
4. Выполните:
```bash
npm run android
```

Или для установки готового APK:
```bash
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

### Через файловый менеджер:
1. Скопируйте APK файл на устройство
2. Откройте файл через файловый менеджер
3. Разрешите установку из неизвестных источников
4. Установите приложение

## Возможные проблемы и решения

### Проблема: "JAVA_HOME is not set"
**Решение:** Настройте переменную окружения JAVA_HOME

### Проблема: "SDK location not found"
**Решение:** Создайте файл `android/local.properties`:
```
sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

### Проблема: Gradle не скачивается
**Решение:** Проверьте подключение к интернету, попробуйте использовать VPN

### Проблема: "Could not find or load main class org.gradle.wrapper.GradleWrapperMain"
**Решение:** Отсутствуют файлы Gradle Wrapper. Выполните следующие шаги:

1. Убедитесь, что директория `android\gradle\wrapper` существует
2. Скачайте `gradle-wrapper.jar` одним из способов:

**Способ 1 (PowerShell):**
```powershell
cd android\gradle\wrapper
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/gradle/gradle/v8.3.0/gradle/wrapper/gradle-wrapper.jar" -OutFile "gradle-wrapper.jar"
```

**Способ 2 (через браузер):**
- Откройте: https://raw.githubusercontent.com/gradle/gradle/v8.3.0/gradle/wrapper/gradle-wrapper.jar
- Сохраните файл как `gradle-wrapper.jar` в папку `android\gradle\wrapper`

**Способ 3 (используя curl, если установлен):**
```bash
cd android\gradle\wrapper
curl -L -o gradle-wrapper.jar https://raw.githubusercontent.com/gradle/gradle/v8.3.0/gradle/wrapper/gradle-wrapper.jar
```

После загрузки файла попробуйте снова выполнить `.\gradlew assembleDebug`

### Проблема: "Could not read script '...@react-native/gradle-plugin/settings.gradle.kts' as it does not exist" или ошибки компиляции Kotlin DSL
**Решение:** Проблема возникает из-за кириллицы в пути проекта и неправильного применения Kotlin DSL файла. Нужно исправить файлы `android/settings.gradle` и `android/build.gradle`:

**1. Исправьте `android/settings.gradle`:**

**Было:**
```gradle
rootProject.name = 'BMRTDEECalculator'
apply from: new File([...], "../settings.gradle.kts")
include ':app'
includeBuild([...])
```

**Должно быть:**
```gradle
rootProject.name = 'BMRTDEECalculator'

pluginManagement {
    repositories {
        mavenCentral()
        google()
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention").version("0.5.0")
}

def reactNativeGradlePluginPath = file("../node_modules/@react-native/gradle-plugin")
include ':app'
includeBuild(reactNativeGradlePluginPath)
```

**2. Исправьте `android/build.gradle` (секция `allprojects`):**

**Было:**
```gradle
maven {
    url(new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(...), "../android"))
}
```

**Должно быть:**
```gradle
maven {
    url(file("../node_modules/react-native/android"))
}
```

Аналогично для `jsc-android`:
```gradle
maven {
    url(file("../node_modules/jsc-android/dist"))
}
```

Это устраняет проблемы с кодировкой кириллицы в путях проекта.

### Проблема: "Minimum supported Gradle version is 8.7. Current version is 8.3"
**Решение:** Нужно обновить версию Gradle в файле `android/gradle/wrapper/gradle-wrapper.properties`:

**Было:**
```
distributionUrl=https\://services.gradle.org/distributions/gradle-8.3-bin.zip
```

**Должно быть:**
```
distributionUrl=https\://services.gradle.org/distributions/gradle-8.7-all.zip
```

После изменения файла Gradle автоматически скачает новую версию при следующей сборке.

### Проблема: "Your project path contains non-ASCII characters"
**Решение:** Если путь проекта содержит кириллицу или другие не-ASCII символы, нужно добавить в файл `android/gradle.properties` следующую строку:

```
android.overridePathCheck=true
```

Это отключит проверку пути и позволит собирать проект в директориях с не-ASCII символами.

### Проблема: "Could not find com.facebook.react:flipper-integration"
**Решение:** Flipper integration - это опциональная зависимость для отладки, которая может быть недоступна. Нужно закомментировать или удалить эту строку в файле `android/app/build.gradle`:

**Было:**
```gradle
dependencies {
    implementation("com.facebook.react:react-android")
    implementation("com.facebook.react:flipper-integration")
    ...
}
```

**Должно быть:**
```gradle
dependencies {
    implementation("com.facebook.react:react-android")
    // Flipper integration is optional and may not be available
    // implementation("com.facebook.react:flipper-integration")
    ...
}
```

### Проблема: "autolinking.json which doesn't exist" или "Could not parse autolinking config file" или "Could not find project.android.packageName"
**Решение:** Файл `autolinking.json` должен быть создан автоматически, но иногда его нужно создать вручную с правильной структурой. Создайте файл `android/build/generated/autolinking/autolinking.json` со следующим содержимым (замените `com.bmrtdeecalculator` на ваш package name):

```json
{
  "reactNativeVersion": "0.76.6",
  "dependencies": {},
  "project": {
    "android": {
      "sourceDir": "../android",
      "appName": "app",
      "packageName": "com.bmrtdeecalculator",
      "applicationId": "com.bmrtdeecalculator",
      "mainActivity": ".MainActivity",
      "watchModeCommandParams": null,
      "dependencyConfiguration": null
    }
  }
}
```

Или выполните команду для создания директории и файла:
```powershell
New-Item -ItemType Directory -Force -Path "android\build\generated\autolinking"
@'
{
  "reactNativeVersion": "0.76.6",
  "dependencies": {},
  "project": {
    "android": {
      "sourceDir": "../android",
      "appName": "app",
      "packageName": "com.bmrtdeecalculator",
      "applicationId": "com.bmrtdeecalculator",
      "mainActivity": ".MainActivity",
      "watchModeCommandParams": null,
      "dependencyConfiguration": null
    }
  }
}
'@ | Out-File -FilePath "android\build\generated\autolinking\autolinking.json" -Encoding UTF8
```

**Важно:** 
- Файл должен содержать поле `reactNativeVersion` и объект `project` с полем `android.packageName`
- Замените `com.bmrtdeecalculator` на ваш реальный package name из `android/app/build.gradle` (поле `namespace` или `applicationId`)
- Этот файл будет автоматически обновляться при сборке проекта

### Проблема: "Keystore file 'debug.keystore' not found for signing config 'debug'"
**Решение:** Для debug сборки можно использовать автоматическую подпись Android. Удалите или закомментируйте секцию `signingConfigs` для debug в файле `android/app/build.gradle`:

**Было:**
```gradle
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
}
buildTypes {
    debug {
        signingConfig signingConfigs.debug
    }
}
```

**Должно быть:**
```gradle
signingConfigs {
    // Debug signing will use default Android debug keystore (auto-generated)
}
buildTypes {
    debug {
        // Uses default Android debug signing (auto-generated keystore)
    }
}
```

Android Gradle Plugin автоматически создаст debug keystore при необходимости.

**Альтернатива:** Если нужен кастомный debug keystore, создайте его командой:
```powershell
cd android\app
keytool -genkeypair -v -storetype PKCS12 -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

### Проблема: "resource mipmap/ic_launcher not found" или "resource mipmap/ic_launcher_round not found"
**Решение:** Отсутствуют иконки приложения. Есть два варианта решения:

**Вариант 1 (быстрое решение):** Используйте стандартные Android иконки. Измените `android/app/src/main/AndroidManifest.xml`:

**Было:**
```xml
android:icon="@mipmap/ic_launcher"
android:roundIcon="@mipmap/ic_launcher_round"
```

**Должно быть:**
```xml
android:icon="@android:drawable/ic_menu_info_details"
android:roundIcon="@android:drawable/ic_menu_info_details"
```

**Вариант 2 (правильное решение):** Создайте собственные иконки:
1. Создайте директории `android/app/src/main/res/mipmap-mdpi/`, `mipmap-hdpi/`, `mipmap-xhdpi/`, `mipmap-xxhdpi/`, `mipmap-xxxhdpi/`
2. Поместите иконки `ic_launcher.png` и `ic_launcher_round.png` в каждую директорию
3. Размеры иконок:
   - mdpi: 48x48 px
   - hdpi: 72x72 px
   - xhdpi: 96x96 px
   - xxhdpi: 144x144 px
   - xxxhdpi: 192x192 px

Для быстрой сборки используйте Вариант 1, для production - Вариант 2.

### Проблема: "library libhermes_executor.so not found" или "UnsatisfiedLinkError"
**Решение:** Отсутствует библиотека Hermes. Есть два варианта:

**Вариант 1 (быстрое решение):** Отключите Hermes и используйте JSC. В файле `android/gradle.properties` измените:

**Было:**
```
hermesEnabled=true
```

**Должно быть:**
```
hermesEnabled=false
```

Затем пересоберите APK:
```bash
cd android
.\gradlew clean
.\gradlew assembleDebug
```

**Вариант 2:** Если нужен Hermes, убедитесь, что все нативные библиотеки включены. Проверьте, что в `android/app/build.gradle` есть:
```gradle
if (hermesEnabled.toBoolean()) {
    implementation("com.facebook.react:hermes-android")
}
```

И выполните полную очистку и пересборку:
```bash
cd android
.\gradlew clean
.\gradlew assembleDebug
```

**Важно:** Если после отключения Hermes появляется ошибка "library libjscexecutor.so not found", это означает, что библиотека JSC не компилируется или не включается в APK. В React Native 0.76 рекомендуется использовать Hermes, так как он более стабилен.

**Решение:** Включите Hermes обратно в `android/gradle.properties`:
```
hermesEnabled=true
```

Затем выполните полную очистку и пересборку:
```bash
cd android
.\gradlew clean
.\gradlew assembleDebug
```

**Примечание:** Hermes - это оптимизированный JavaScript движок, разработанный специально для React Native. Он работает стабильнее, чем JSC, особенно в React Native 0.76. Если вам все же нужен JSC, убедитесь, что библиотека `libjsctooling.so` (в которую объединяется `libjscexecutor.so` в React Native 0.76) включена в APK.

### Проблема: "Invalid character in header content" в Metro bundler
**Решение:** Эта ошибка возникает из-за кириллицы в пути проекта. Обновите `metro.config.js`:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const config = {
  projectRoot: path.resolve(__dirname),
  watchFolders: [path.resolve(__dirname)],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

Ошибка не критична - Metro bundler все равно работает, но может вызывать проблемы. Лучшее решение - переместить проект в путь без кириллицы.

### Проблема: Приложение сразу закрывается после запуска
**Решение:** Это обычно происходит из-за отсутствия JavaScript bundle в APK или ошибки в коде. Выполните следующие шаги:

1. **Проверьте логи:**
```bash
adb logcat | grep -i "ReactNative\|AndroidRuntime\|FATAL"
```

2. **Для Release APK соберите JavaScript bundle:**
```bash
# Создайте директорию assets
mkdir -p android/app/src/main/assets

# Соберите bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

3. **Проверьте имя компонента:**
   - В `MainActivity.kt` должно быть: `getMainComponentName(): String = "BMRTDEECalculator"`
   - В `app.json` должно быть: `"name": "BMRTDEECalculator"`
   - В `index.js` должно быть: `AppRegistry.registerComponent(appName, () => App)`

4. **Для Debug сборки убедитесь, что Metro bundler запущен:**
```bash
npm start
```

5. **Проверьте инициализацию базы данных:**
   - Убедитесь, что `DatabaseService.initDatabase()` не выбрасывает ошибку
   - Проверьте права доступа к файловой системе на устройстве

6. **Альтернатива - используйте Debug APK с Metro bundler:**
```bash
# Терминал 1: Запустите Metro bundler
npm start

# Терминал 2: Установите и запустите приложение
npm run android
```

### Проблема: "No connected devices!" при запуске `npm run android`
**Решение:** Нет подключенного Android устройства или запущенного эмулятора. Есть несколько вариантов:

**Вариант 1: Подключить физическое устройство**
1. Включите "Режим разработчика" на Android устройстве:
   - Перейдите в Настройки → О телефоне
   - Нажмите 7 раз на "Номер сборки"
2. Включите "Отладка по USB":
   - Настройки → Для разработчиков → Отладка по USB
3. Подключите устройство по USB
4. Проверьте подключение:
```bash
adb devices
```
5. Запустите приложение:
```bash
npm run android
```

**Вариант 2: Запустить Android эмулятор**
1. Откройте Android Studio
2. Запустите AVD Manager (Android Virtual Device Manager)
3. Создайте или запустите существующий эмулятор
4. Дождитесь полной загрузки эмулятора
5. Запустите приложение:
```bash
npm run android
```

**Вариант 3: Установить APK вручную (без подключения к компьютеру)**
1. Соберите APK:
```bash
cd android
.\gradlew assembleDebug
```
2. Скопируйте файл `android\app\build\outputs\apk\debug\app-debug.apk` на устройство
3. Установите APK через файловый менеджер на устройстве
4. **ВАЖНО:** Для работы приложения нужно запустить Metro bundler:
```bash
npm start
```
5. Убедитесь, что устройство и компьютер в одной Wi-Fi сети
6. В приложении встряхните устройство и выберите "Settings" → "Debug server host & port for device"
7. Введите IP адрес компьютера и порт 8081 (например: `192.168.1.100:8081`)

**Вариант 4: Собрать Release APK с включенным bundle (работает без Metro bundler)**
1. Соберите JavaScript bundle и APK:
```bash
npm run android:build:release
```
2. Установите APK на устройство (через USB или файловый менеджер)
3. Приложение будет работать без подключения к компьютеру

### Проблема: Ошибки компиляции TypeScript
**Решение:**
```bash
npm run lint
npm run build
```

## Автоматизация сборки

Для упрощения процесса можно добавить скрипты в `package.json`:

```json
{
  "scripts": {
    "android:build": "cd android && gradlew assembleRelease",
    "android:install": "adb install android/app/build/outputs/apk/release/app-release.apk"
  }
}
```

Затем выполнить:
```bash
npm run android:build
npm run android:install
```

## Сборка JavaScript Bundle для Release APK

**ВАЖНО:** Для release APK нужно собрать JavaScript bundle и включить его в APK:

```bash
# Соберите bundle перед сборкой release APK
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

Или добавьте в `android/app/build.gradle` автоматическую сборку bundle:

```gradle
project.ext.react = [
    enableHermes: true,
]

apply from: file("../../node_modules/@react-native/gradle-plugin/react.gradle")
```

## Проверка логов при падении приложения

Если приложение сразу закрывается после запуска, проверьте логи:

**Windows PowerShell:**
```powershell
# Подключите устройство/эмулятор и выполните:
adb logcat | Select-String -Pattern "ReactNative|AndroidRuntime|FATAL|Error"
```

**Или для более детальных логов:**
```powershell
adb logcat *:E
```

**Или для фильтрации только вашего приложения:**
```powershell
adb logcat | Select-String -Pattern "BMRTDEECalculator|com.bmrtdeecalculator"
```

**Для очистки логов перед проверкой:**
```powershell
adb logcat -c
# Затем запустите приложение и смотрите логи
adb logcat
```

## Проверка работоспособности

После установки APK:
1. Откройте приложение на устройстве
2. Проверьте все экраны: Главный, Расчет, Результаты, История
3. Выполните тестовый расчет
4. Проверьте сохранение в историю
5. Проверьте отображение результатов

---

**Примечание:** В рамках данной курсовой работы представлен полный исходный код приложения. Для реальной сборки APK потребуется полная настройка окружения React Native со всеми зависимостями.
