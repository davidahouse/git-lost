#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const conf = require('rc')('git-lost', {
  // defaults
  workingFolder: '.',
  showDirty: true,
  showClean: false,
})

clear()
console.log(chalk.yellow(figlet.textSync('git-lost', {horizontalLayout: 'full'})))
console.log(chalk.yellow('version 0.1.0'))
console.log(chalk.yellow('searching for repositories in ' + conf.workingFolder))

findRepos(conf.workingFolder)

/**
 * findRepos
 * @param {string} folder The folder to find repositories in
 */
function findRepos(folder) {
  if (fs.existsSync(folder + '/.git')) {
    const simpleGit = require('simple-git')(folder)
    simpleGit.status(function(err, result) {
      const basename = folder.replace(conf.workingFolder, '')
      if (result.files.length > 0) {
        if (conf.showDirty) {
          console.log(chalk.red(basename + '(' + result.current + ')'))
        }
      } else {
        if (conf.showClean) {
          console.log(chalk.green(basename + '(' + result.current + ')'))
        }
      }
    })
  } else {
    fs.readdirSync(folder).filter(function(file) {
      if (fs.statSync(folder+'/'+file).isDirectory()) {
        findRepos(folder + '/' + file)
      }
    })
  }
}
