const path = require('path');
const os = require('os');
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const readDir = promisify(fs.readdir);

const HOME_DIR = os.homedir();
const privateProjectsFolder = path.join(HOME_DIR, 'dev');
const githubProjectsFolder = path.join(HOME_DIR, 'dev', 'github');
const forksFolder = path.join(HOME_DIR, 'dev', 'forks');

module.exports = async () => {
  const projects = await getProjects();
  return {
    label: 'Projects',
    submenu: Object.keys(projects).reduce((items, key) => {
      if (key !== 0) {
        items.push({ type: 'separator' });
      }
      return [
        ...items,
        {
          label: projects[key].label,
          submenu: projects[key].items.map(item => ({
            label: item.name,
            type: 'normal',
            click: () => openInAtom(item.path),
          })),
        },
      ];
    }, []),
  };
};

async function getProjects() {
  const [privateProjects, githubProjects, forks] = await Promise.all([
    readDir(privateProjectsFolder),
    readDir(githubProjectsFolder),
    readDir(forksFolder),
  ]);
  return {
    privateProjects: {
      label: 'Private',
      items: privateProjects.filter(ignore).map(toProject(privateProjectsFolder)),
    },
    githubProjects: {
      label: 'GitHub',
      items: githubProjects.filter(ignore).map(toProject(githubProjectsFolder)),
    },
    forks: { label: 'Forks', items: forks.filter(ignore).map(toProject(forksFolder)) },
  };
}

function ignore(item) {
  return item !== 'forks' && item !== 'github' && item !== '.DS_Store';
}

function toProject(folder) {
  return item => ({ name: item, path: path.join(folder, item) });
}

function openInAtom(projectPath) {
  return exec(`atom ${projectPath}`);
}
