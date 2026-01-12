/**
 * BMR/TDEE Calculator
 * Мобильное приложение для расчета базового метаболизма и суточной потребности в калориях
 * 
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './navigation';
import { Colors } from './styles';
import { DatabaseService } from './services';

const App = () => {
  useEffect(() => {
    // Инициализация базы данных при запуске приложения
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await DatabaseService.initDatabase();
      console.log('[App] Application initialized successfully');
    } catch (error) {
      console.error('[App] Failed to initialize application:', error);
      // Не прерываем запуск приложения при ошибке инициализации БД
      // Приложение может работать с ограниченной функциональностью
    }
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary}
      />
      <AppNavigator />
    </>
  );
};

export default App;
