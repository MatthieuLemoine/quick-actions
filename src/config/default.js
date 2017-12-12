const os = require('os');

const HOME_DIR = os.homedir();

module.exports = {
  editor: 'atom',
  projectDirs: [
    {
      name: 'Projects',
      path: `${HOME_DIR}/Dev`,
    },
  ],
  filterProjects: name => name !== '.DS_Store',
};
