const path = require('path');
const fs = require('fs');
const {
  Tray, Menu, app, dialog,
} = require('electron');
const { promisify } = require('util');
const { exec } = require('child_process');
const AutoLaunch = require('auto-launch');
const GhReleases = require('electron-gh-releases');
const config = require('./config');

const execPath = process.execPath.includes('node_modules')
  ? path.join(__dirname, '..', 'dev-start.sh')
  : process.execPath;

const autoStart = new AutoLaunch({
  name: 'quick-actions',
  isHidden: true,
  path: execPath,
});

const readDir = promisify(fs.readdir);

const ACTIONS_DIR = path.join(__dirname, 'actions');

// Don't show app in macOS dock
if (app.dock) {
  app.dock.hide();
}

app.on('ready', async () => {
  try {
    const tray = new Tray(path.join(__dirname, '..', 'assets', 'icon.png'));
    // Get all actions from src/actions
    const actions = (await readDir(ACTIONS_DIR)).map(action =>
      require(path.join(ACTIONS_DIR, action)),
    );
    // Get custom actions
    const customActions = (await readDir(config.actionsDir)).map(action =>
      require(path.join(config.actionsDir, action)),
    );
    const template = await Promise.all(
      [...customActions, ...actions].map(getAction => getAction(config)),
    );
    const isAutoStartEnabled = await autoStart.isEnabled();
    const contextMenu = Menu.buildFromTemplate([
      ...template,
      { type: 'separator' },
      {
        label: 'Options',
        submenu: [
          {
            label: 'Open at login',
            type: 'checkbox',
            click: toggleAutoStart,
            checked: isAutoStartEnabled,
          },
        ],
      },
      {
        label: 'Configuration',
        type: 'normal',
        click: () => openInEditor(config.editor || 'atom', config.CONFIG_FILE),
      },
      {
        label: 'Check for updates',
        type: 'normal',
        click: () => checkAutoUpdate(true),
      },
      { role: 'quit', label: 'Close' },
    ]);
    tray.setToolTip('Quick actions');
    tray.setContextMenu(contextMenu);
    checkAutoUpdate();
  } catch (e) {
    console.error(e);
  }
});

async function toggleAutoStart() {
  const isAutoStartEnabled = await autoStart.isEnabled();
  if (isAutoStartEnabled) {
    return autoStart.disable();
  }
  return autoStart
    .enable()
    .then(() => console.log('Done'))
    .catch(console.error);
}

function openInEditor(editor, projectPath) {
  return exec(`atom ${projectPath}`);
}

function checkAutoUpdate(showDialog) {
  const version = app.getVersion();
  const autoUpdateOptions = {
    repo: 'MatthieuLemoine/quick-actions',
    currentVersion: app.getVersion(),
  };
  const updater = new GhReleases(autoUpdateOptions);
  updater.on('error', (event, message) => {
    console.error('Error while updating.');
    console.error(`Event: ${JSON.stringify(event)}. MESSAGE: ${message}`);
  });
  updater.on('update-downloaded', () => {
    // Restart the app(ask) and install the update
    confirmAutoUpdate(updater);
  });
  // Check for updates
  updater.check((err, status) => {
    // There is an update but can't auto-update
    if (err && status) {
      if (showDialog) {
        dialog.showMessageBox({
          type: 'info',
          buttons: ['Close'],
          title: 'An update is avaible',
          message: 'A new version of Quick Actions is available but need to be installed manually.',
        });
      }
      return null;
    }
    // Unexpected error
    if (err) {
      if (showDialog) {
        dialog.showMessageBox({
          type: 'error',
          buttons: ['Close'],
          title: 'An error occurred while updating',
          message: 'An unexpected error occured while updating Quick Actions. Please try again.',
        });
      }
      return console.error(err);
    }
    // Update
    if (status) {
      return updater.download();
    }
    // Up to date
    if (showDialog) {
      dialog.showMessageBox({
        type: 'info',
        buttons: ['Close'],
        title: 'No update available',
        message: `Quick Actions is up to date. ${version} is the latest version`,
      });
    }
    console.log(`Quick Actions is up to date. ${version} is the latest version`);
    return null;
  });
}

function confirmAutoUpdate(updater) {
  dialog.showMessageBox(
    {
      type: 'question',
      buttons: ['Update & Restart', 'Cancel'],
      title: 'Update Available',
      cancelId: 99,
      message: 'There is an update available. Would you like to update Quick Actions now?',
    },
    (response) => {
      console.log(`Exit: ${response}`);
      if (response === 0) {
        updater.install();
      }
    },
  );
}
