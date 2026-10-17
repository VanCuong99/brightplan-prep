const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
// Explicitly watch our pure shared source outside the Expo app directory.
config.watchFolders = [path.resolve(__dirname, "../..")];
module.exports = config;
