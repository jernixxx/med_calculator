const {getDefaultConfig} = require('expo/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://docs.expo.dev/guides/customizing-metro/
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Добавляем поддержку путей с кириллицей
config.projectRoot = path.resolve(__dirname);
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
