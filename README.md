# BMR/TDEE Калькулятор

Мобильное приложение для расчета базового метаболизма (BMR) и суточной потребности в калориях (TDEE).

## Описание

Медицинский калькулятор BMR/TDEE - это специализированный инструмент для врачей-диетологов и пациентов, позволяющий рассчитывать энергетические потребности организма на основе медицински признанных формул.

## Функционал

- Расчет BMR по формулам Mifflin-St Jeor и Harris-Benedict
- Расчет TDEE с учетом уровня физической активности  
- Интерпретация результатов с рекомендациями
- История расчетов с возможностью отслеживания динамики
- Статистика и графики изменений
- Локальное хранение данных (SQLite)

## Скриншоты экранов приложения

<img width="651" height="1280" alt="image" src="https://github.com/user-attachments/assets/bd7d004c-5885-44b9-8505-3c160efd5e9e" /> <img width="632" height="1280" alt="image" src="https://github.com/user-attachments/assets/a99fd68a-3524-46d7-b1bb-cb237a0b6910" /> <img width="632" height="1280" alt="image" src="https://github.com/user-attachments/assets/dae4e066-9542-467a-ab4c-96fc93286ad7" /> <img width="632" height="1280" alt="image" src="https://github.com/user-attachments/assets/5341c2b4-17db-4afd-b45d-41a9588618df" />




## Технологии

- React Native 0.76+ с TypeScript
- React Navigation 7
- SQLite (react-native-sqlite-storage)
- React Native Chart Kit

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Для Android:
```bash
npm run android
```

3. Для iOS:
```bash
cd ios && pod install && cd ..
npm run ios
```

## Сборка APK

```bash
cd android
./gradlew assembleRelease
```

Файл APK будет находиться в `android/app/build/outputs/apk/release/`

## Структура проекта

```
src/
├── screens/          # Экраны приложения
├── components/       # Переиспользуемые компоненты
├── services/         # Бизнес-логика
├── models/           # TypeScript типы
├── utils/            # Вспомогательные функции
└── navigation/       # Конфигурация навигации
```

## Документация

Полная документация находится в папке `docs/`:
- `TZ.md` - Техническое задание
- `Architecture.md` - Архитектура приложения
- `DataModels.md` - Модели данных
- `Explanatory_Note.md` - Пояснительная записка

## Лицензия

Курсовая работа для ВУЗа
