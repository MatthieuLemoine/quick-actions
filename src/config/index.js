const os = require('os');
const path = require('path');
const fs = require('fs');
const defaultConfig = require('./default');

const HOME_DIR = os.homedir();
const CONFIG_DIR = path.join(HOME_DIR, '.quick-actions');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.js');
const DEFAULT_CONFIG_FILE = path.join(__dirname, 'default.js');
const ACTIONS_DIR = path.join(CONFIG_DIR, 'actions');

if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR);
}
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, fs.readFileSync(DEFAULT_CONFIG_FILE));
}
if (!fs.existsSync(ACTIONS_DIR)) {
  fs.mkdirSync(ACTIONS_DIR);
}

module.exports = Object.assign({ CONFIG_FILE }, defaultConfig, require(CONFIG_FILE));
