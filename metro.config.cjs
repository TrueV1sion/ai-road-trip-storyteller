const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution
config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;