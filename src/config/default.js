const os = require('os');
const path = require('path');

const HOME_DIR = os.homedir();

module.exports = {
  actionsDir: path.join(HOME_DIR, '.quick-actions', 'actions'),
  editor: 'atom',
  projectDirs: [
    {
      name: 'Projects',
      path: path.join(HOME_DIR, 'Dev'),
    },
  ],
  filterProjects: name => name !== '.DS_Store',
};
