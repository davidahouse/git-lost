#!/usr/bin/env node
const fs = require('fs')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const path = require('path')
const conf = require('rc')('git-lost', {
  // defaults
  workingFolder: '.',
  showDirty: true,
  showClean: false
})

clear()
console.log(chalk.yellow(figlet.textSync('git-lost', {horizontalLayout: 'full'})))

findRepos(conf.workingFolder)

function findRepos(folder) {

  if (fs.existsSync(folder + '/.git')) {
    const simpleGit = require('simple-git')(folder)
    simpleGit.status(function(err,result) {
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
    let files = fs.readdirSync(folder)
    const folders = fs.readdirSync(folder).filter(function(file) {
      if (fs.statSync(folder+'/'+file).isDirectory()) {
        findRepos(folder + '/' + file)
      }
    })
  }
}
