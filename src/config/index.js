const os = require('os');
const path = require('path');
const fs = require('fs');
const defaultConfig = require('./default');

const HOME_DIR = os.homedir();
const CONFIG_DIR = path.join(HOME_DIR, '.quick-actions');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.js');
const DEFAULT_CONFIG_FILE = path.join(__dirname, 'default.js');

if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR);
}
if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(CONFIG_FILE, fs.readFileSync(DEFAULT_CONFIG_FILE));
}

module.exports = Object.assign({}, defaultConfig, require(CONFIG_FILE));
