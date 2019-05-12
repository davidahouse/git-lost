#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const conf = require('rc')('git-lost', {
  // defaults
  workingFolder: '.',
  // actions:
  // dirty  (show repositories that have local changes or aren't in sync with remote)
  // list   (list all the repositories)
  // branch (show repositories that aren't on the default branch)
  action: 'dirty',
  defaultBranches: 'development, master, release',
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
        if (conf.action === 'dirty' || conf.action === 'list') {
          console.log(chalk.red('🚧' + basename + '(' + result.current + ')'))
        }
      } else {
        if (result.ahead > 0) {
          if (conf.action === 'dirty' || conf.action === 'list') {
            console.log(chalk.yellow('🗒' + basename + '(' + result.current + ')'))
          }
        } else if (result.behind > 0) {
          if (conf.action === 'dirty' || conf.action === 'list') {
            console.log(chalk.yellow('🔁' + basename + '(' + result.current + ')'))
          }
        } else {
          if (conf.defaultBranches.indexOf(result.current) >= 0) {
            if (conf.action === 'list') {
              console.log(chalk.green('✅' + basename + '(' + result.current + ')'))
            }
          } else {
            if (conf.action === 'branch' || conf.action === 'list') {
              console.log(chalk.red('🌳' + basename + '(' + result.current + ')'))
            }
          }
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
