import { StyleSheet } from 'react-native';
import Colors from './colors';

// Типографика приложения
export const Typography = StyleSheet.create({
  // Заголовки
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 6,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  
  // Основной текст
  body1: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  
  // Вспомогательный текст
  caption: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  overline: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  
  // Специальные
  button: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    fontSize: 16,
    color: Colors.text,
  },
});

export default Typography;
