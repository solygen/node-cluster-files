node-cluster-files
======================

> CLI that rename files of a directory based on the creation date and clusters them in monthly based subdirectories

__cluster.js__
- client

__cluster-core.js__
- core functionality

_function: process(basepath)_
returns hash with source/target

```
  Usage: cluster-cli <path (default:current path)> [options]

  Clusters files in subdirectories based on month of creation

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -r, --rename     also rename files [YYYY-MM-DD_HH-mm-ss]
    -o, --overwrite  overwrite if file already exists (when rename is disabeld)
    -d, --details    show detailed output
    -s, --simulate   simulate
    -y, --yes        skip prompt
```


__example__
```
$ ls my-path

001.jpg
002.jpg
003.jpg

$ cluster my-path
$ ls

2015-09/2015-09-04_12-31-57.jpg
2015-09/2015-09-04_13-34-01.jpg
2015-09/2015-09-11_17-31-49.jpg
```


__todo__
- may use https://www.npmjs.com/package/fs-tools
