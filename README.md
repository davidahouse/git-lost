## git-lost

[![npm (scoped)](https://img.shields.io/npm/v/@davidahouse/git-lost.svg)](https://www.npmjs.com/package/davidahouse/git-lost)

This command line tool will find any local git repositories that have a dirty working folder.

Installation:

```
npm install -g @davidahouse/git-lost
```

Usage:

```
git-lost --workingFolder /someFolder
```

You can also create a ~/.git-lostrc file and set a global working folder so you don't have to specify it on the command line. Format is:

```
workingFolder=/someFolder
```

The default action is `dirty` which finds any repositories that have local changes or are ahead or behind the remote. The other commands are `branch` and `list`. `branch` shows any repositories that aren't on the default branch, and `list` shows all repositories found.

You can specify the action on the command line:

```
git-lost --action branch
```
