## git-lost

[![npm (scoped)](https://img.shields.io/npm/v/@davidahouse/git-lost.svg)](https://www.npmjs.com/package/davidahouse/git-lost)

This command line tool will find any local git repositories that have a dirty working folder.

Installation:

```
npm install -g git-lost
```

Usage:

```
git-lost --workingFolder /someFolder
```

You can also create a ~/.git-lostrc file and set a global working folder so you don't have to specify it on the command line. Format is:

```
workingFolder=/someFolder
```
