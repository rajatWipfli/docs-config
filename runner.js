#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const config = require('./config');
// Replace the --documentation-- part with the correct tutorial path from config
const necessaryFolders = ['--documentation--', '--documentation--/assets', '--documentation--/scripts', '--documentation--/styles'];
function createNecessaryFolders(root, config) {
  const isOutsideRoot = path.isAbsolute(config.opts.tutorials) && !path.resolve(config.opts.tutorials).includes(path.resolve(root));
  // If Outside the root dir, skip creation of files for safety against overwriting user files
  if (isOutsideRoot) {
    return;
  }
  const tutorialPath = !path.isAbsolute(config.opts.tutorials) ? path.join(root, config.opts.tutorials) : config.opts.tutorials;
  // Skip creation of files when folder already exists
  if (fs.existsSync(tutorialPath)) {
    return;
  }
  necessaryFolders.forEach(folderName => {
    const folderPath = path.join(tutorialPath, folderName.replace('--documentation--', ''));
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  });
}

function createSampleFiles(root, config) {
  const tutorialPath = !path.isAbsolute(config.opts.tutorials) ? path.join(root, config.opts.tutorials) : config.opts.tutorials;
  // Skip creation of files when folder already exists
  if (fs.existsSync(tutorialPath)) {
    return;
  }
  fs.copyFileSync(path.resolve(__dirname, './sample.md'), path.join(tutorialPath, 'sample.md'));
}

function run() {
  const command = process.argv.slice(2);
  if (!command[0]) {
    return;
  }
  if (command[0] === 'setup') {
    createNecessaryFolders(process.cwd(), config);
    createSampleFiles(process.cwd(), config);
  }
}

module.exports.createNecessaryFolders = createNecessaryFolders;
module.exports.createSampleFiles = createSampleFiles;

// When used as a CMDLine
if (require.main === module) {
  run();
}
