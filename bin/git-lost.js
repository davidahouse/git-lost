#!/usr/bin/env node
const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const Queue = require('better-queue');
const EventEmitter = require('events');

var pkginfo = require('pkginfo')(module);
const conf = require('rc')('git-lost', {
  // defaults
  workingFolder: '.',
  defaultBranches: 'development, master, release'
});

const eventEmitter = new EventEmitter();
const git = require('simple-git/promise');

clear();
console.log(
  chalk.green(figlet.textSync('git-lost', { horizontalLayout: 'full' }))
);
console.log(chalk.green(module.exports.version));
console.log(chalk.green('searching for repositories in ' + conf.workingFolder));

const q = new Queue(
  function(iteration, cb) {
    getStatus(iteration.folder, cb);
  },
  { concurrent: 3 }
);

q.on('drain', function() {
  eventEmitter.emit('finished');
});

eventEmitter.on('finished', function(result) {
  var stats = q.getStats();
  console.log(
    chalk.green('Finished checking ' + stats.total + ' repositories...')
  );
});

findRepos(conf.workingFolder);

/**
 * getStatus
 * @param {*} folder
 * @param {*} cb
 */
async function getStatus(folder, cb) {
  try {
    await git(folder)
      .silent(true)
      .fetch();
  } catch (e) {}
  const result = await git(folder).status();
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
  cb();
}

/**
 * findRepos
 * @param {string} folder The folder to find repositories in
 */
function findRepos(folder) {
  if (fs.existsSync(folder + '/.git')) {
    q.push({ folder: folder });
  } else {
    fs.readdirSync(folder).filter(function(file) {
      if (fs.statSync(folder + '/' + file).isDirectory()) {
        findRepos(folder + '/' + file);
      }
    });
  }
}
