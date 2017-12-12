# :zap: Quick Actions

A macOS/Linux menubar app to execute quick actions.

## Install

```
yarn
```

## Configuration

The configuration can be found in `$HOME_DIR/.quick-actions/config.js`.

```javascript
// Default configuration
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
```

- `editor` : your favorite editor.
- `projectDirs` : where to look for your projects.
- `filterProjects` : a function called to hide some files/folders.

## Features

* Open projects in your favorite editor.
