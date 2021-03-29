const fs = require('fs');
const path = require('path');

const ROOT_DIRECTORY = path.dirname(__dirname);

const ROOT_BUILD_DIRECTORY = path.join(ROOT_DIRECTORY, 'build');
const PACKAGES_DIRECTORY = path.join(ROOT_DIRECTORY, 'packages');

/**
 * Remove a directory and all its contents.
 *
 * @param {string} directory 
 */
function removeDirectory(directory) {
  fs.rmdirSync(directory, { recursive: true }, (error) => {
    if (error) throw error;

    console.log(`Removed '${directory}'`);
  });
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
 * Remove all build directories.
 */
function clean() {
  fs.readdirSync(PACKAGES_DIRECTORY).forEach(package => {
    const packagePath = path.join(PACKAGES_DIRECTORY, package);

    if (isDirectory(packagePath)) {
      const buildPath = path.join(packagePath, 'build');
      removeDirectory(buildPath);
    }
  });

  removeDirectory(ROOT_BUILD_DIRECTORY);
}

clean();
