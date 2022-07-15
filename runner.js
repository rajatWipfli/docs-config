#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const necessaryFolders = ['documentation', 'documentation/assets', 'documentation/scripts', 'documentation/styles'];
function createNecessaryFolders(root) {
  necessaryFolders.forEach(folderName => {
    if (!fs.existsSync(path.join(root, folderName))) {
      fs.mkdirSync(path.join(root, folderName));
    }
  });
}
function createSampleFiles(root) {
  fs.copyFileSync(path.resolve('./sample.md'), path.join(root, 'documentation', 'sample.md'));
}

function run() {
  const command = process.argv.slice(2);
  if (!command[0]) {
    return;
  }
  if (command[0] === 'setup') {
    createNecessaryFolders(process.cwd());
    createSampleFiles(process.cwd());
  }
}

module.exports.createNecessaryFolders = createNecessaryFolders;
module.exports.createSampleFiles = createSampleFiles;

// When used as a CMDLine
if (require.main === module) {
  run();
}
