# :zap: Quick Actions

A extensible macOS/Linux menubar app to execute quick actions.

## Install

```
yarn
```

## Built-in actions

* Open projects in your favorite editor.

## Configuration

The configuration can be found in `$HOME_DIR/.quick-actions/config.js`.

```javascript
// Default configuration
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
```

- `actionsDir` : a place to define your own actions.
- `editor` : your favorite editor.
- `projectDirs` : where to look for your projects.
- `filterProjects` : a function called to hide some files/folders.


## Adding my own actions

Custom actions must be added in the `actionsDir` folder specified in the config file.

An action is just a function which returns a [MenuItem](https://github.com/electron/electron/blob/master/docs/api/menu-item.md) object. It can also return a Promise that will be resolved to a [MenuItem](https://github.com/electron/electron/blob/master/docs/api/menu-item.md).

```javascript
// The config object is passed as first argument
module.exports = config => {
  // Do something
  return {
    label : 'Custom action',
    type : 'normal',
    click : () => console.log('Clicked')
  };
};
```

You can have a look to the [open-in-editor](https://github.com/MatthieuLemoine/quick-actions/blob/master/src/actions/open-in-editor/index.js) action for a more complex example.
