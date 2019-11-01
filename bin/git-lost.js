#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
var pkginfo = require('pkginfo')(module);
const conf = require('rc')('git-lost', {
  // defaults
  workingFolder: '.',
  defaultBranches: 'development, master, release'
});

clear();
console.log(
  chalk.yellow(figlet.textSync('git-lost', { horizontalLayout: 'full' }))
);
console.log(chalk.yellow(module.exports.version));
console.log(
  chalk.yellow('searching for repositories in ' + conf.workingFolder)
);

findRepos(conf.workingFolder);

/**
 * findRepos
 * @param {string} folder The folder to find repositories in
 */
function findRepos(folder) {
  if (fs.existsSync(folder + '/.git')) {
    const simpleGit = require('simple-git')(folder);
    simpleGit.silent(true);
    try {
      simpleGit.fetch(function(err, result) {
        checkStatus(simpleGit, folder);
      });
    } catch (e) {
      checkStatus(simpleGit, folder);
    }
  } else {
    fs.readdirSync(folder).filter(function(file) {
      if (fs.statSync(folder + '/' + file).isDirectory()) {
        findRepos(folder + '/' + file);
      }
    });
  }
}

function checkStatus(simpleGit, folder) {
  simpleGit.status(function(err, result) {
    const basename = folder.replace(conf.workingFolder, '');
    if (result.files.length > 0) {
      console.log(chalk.red('🚧' + basename + '(' + result.current + ')'));
    } else if (result.ahead > 0) {
      console.log(chalk.yellow('🗒' + basename + '(' + result.current + ')'));
    } else if (result.behind > 0) {
      console.log(chalk.yellow('🔁' + basename + '(' + result.current + ')'));
    } else if (conf.defaultBranches.indexOf(result.current) == -1) {
      console.log(chalk.red('🌳' + basename + '(' + result.current + ')'));
    }
  });
}
