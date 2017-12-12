const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const readDir = promisify(fs.readdir);

module.exports = async (config) => {
  const projects = await getProjects(config);
  if (projects.length === 1) {
    return {
      label: 'Projects',
      submenu: projects[0].items.map(item => ({
        label: item.name,
        type: 'normal',
        click: () => openInEditor(config.editor || 'atom', item.path),
      })),
    };
  }
  return {
    label: 'Projects',
    submenu: projects.reduce((items, project, index) => {
      if (index !== 0) {
        items.push({ type: 'separator' });
      }
      return [
        ...items,
        {
          label: project.label,
          submenu: project.items.map(item => ({
            label: item.name,
            type: 'normal',
            click: () => openInEditor(config.editor || 'atom', item.path),
          })),
        },
      ];
    }, []),
  };
};

async function getProjects(config) {
  const allProjects = await Promise.all(
    config.projectDirs.map(item =>
      readDir(item.path ? item.path : item).catch(err => console.warn(err) || []),
    ),
  );
  return allProjects.map((projects, index) => {
    const dir = config.projectDirs[index];
    const label = dir.name || dir.path || dir;
    const dirPath = dir.path || dir;
    return {
      label,
      items: projects.filter(config.filterProjects).map(toProject(dirPath)),
    };
  });
}

function toProject(folder) {
  return item => ({ name: item, path: path.join(folder, item) });
}

function openInEditor(editor, projectPath) {
  return exec(`atom ${projectPath}`);
}
