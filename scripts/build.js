const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIRECTORY = path.dirname(__dirname);

const ROOT_PUBLIC_DIRECTORY = path.join(ROOT_DIRECTORY, 'public');
const ROOT_BUILD_DIRECTORY = path.join(ROOT_DIRECTORY, 'build');
const PACKAGES_DIRECTORY = path.join(ROOT_DIRECTORY, 'packages');

/** Run the build command in all packages. */
function buildPackages() {
  child_process.execSync('lerna run build');
}

/**
 * Determine if the path is a directory.
 *
 * @param {string} path 
 */
function isDirectory(path) {
  return fs.lstatSync(path).isDirectory()
}

/**
 * Copy the contents from one folder to another.
 *
 * @param {string} from 
 * @param {string} to 
 */
function copyFolder(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to);

  fs.readdirSync(from).forEach(item => {
    const source = path.join(from, item);
    const destination = path.join(to, item);

    if (isDirectory(source)) {
      copyFolder(source, destination);
      return;
    }

    fs.copyFileSync(source, destination);
  });
}

/**
 * Copy all builds into the root build.
 */
function combineBuilds() {
  fs.mkdirSync(ROOT_BUILD_DIRECTORY);

  if (fs.existsSync(ROOT_PUBLIC_DIRECTORY)) {
    copyFolder(ROOT_PUBLIC_DIRECTORY, ROOT_BUILD_DIRECTORY);
  }

  fs.readdirSync(PACKAGES_DIRECTORY).forEach(package => {
    const packagePath = path.join(PACKAGES_DIRECTORY, package);

    if (isDirectory(packagePath)) {
      const buildPath = path.join(packagePath, 'build');

      if (isDirectory(buildPath)) copyFolder(buildPath, ROOT_BUILD_DIRECTORY);
    }
  });
}

buildPackages();
combineBuilds();
