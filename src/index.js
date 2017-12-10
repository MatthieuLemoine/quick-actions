const path = require('path');
const fs = require('fs');
const { Tray, Menu, app } = require('electron');
const { promisify } = require('util');

const readDir = promisify(fs.readdir);

const ACTIONS_DIR = path.join(__dirname, 'actions');

// Don't show app in macOS dock
app.dock.hide();

app.on('ready', async () => {
  try {
    const tray = new Tray(path.join(__dirname, '..', 'assets', 'icon.png'));
    // Get all actions from src/actions
    const actions = (await readDir(ACTIONS_DIR)).map(action =>
      require(path.join(ACTIONS_DIR, action)),
    );
    const template = await Promise.all(actions.map(getAction => getAction()));
    const contextMenu = Menu.buildFromTemplate([
      ...template,
      { type: 'separator' },
      {
        label: 'Options',
        submenu: [
          {
            label: 'Open at login',
            type: 'checkbox',
            click: toggleOpenAtLogin,
            checked: app.getLoginItemSettings().openAtLogin,
          },
        ],
      },
      { role: 'quit', label: 'Close' },
    ]);
    tray.setToolTip('Quick actions');
    tray.setContextMenu(contextMenu);
  } catch (e) {
    console.error(e);
  }
});

function toggleOpenAtLogin(e) {
  return app.setLoginItemSettings({
    openAtLogin: e.checked,
  });
}
