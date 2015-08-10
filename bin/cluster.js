//#!/usr/bin/env node
(function() {

    'use strict';

    var fs = require('fs'),
        moment = require('moment'),
        inquirer = require('inquirer'),
        pt = require('path'),
        bfs = require('fs-bfs');

    // first cli parameter or current directory
    var base = process.argv[2] || process.cwd();

    function cont (answers) {

        if (answers.process !== 'yes') return;

        var data = bfs(base);

        function extension(file) {
            var list = file.split('.');
            return list[list.length - 1];
        }

        // move files to subfolders
        (data.files).forEach(function(data) {
            var path = data.path,
                file = data.name,
                counter = 1;

            var stats = fs.statSync(path),
                subdir = stats.mtime.toISOString().substr(0, 7),
                dir = pt.join(base, subdir),
                target = pt.join(dir, file),
                time = moment(stats.mtime);

            var name = time.format('YYYY-MM-DD_HH-mm-ss') + '.' + extension(file);
            target = pt.join(dir, name);

            // add one second to filenames time part until no file will be overwritten
            while (fs.existsSync(target)) {
                time = time.add('s', 1);
                name = time.format('YYYY-MM-DD_HH-mm-ss') + '.' + extension(file);
                target = pt.join(dir, name);
            }

            // create subdir
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            // rename/move
            if (!fs.existsSync(target)) {
                fs.renameSync(path, target);
            }
        });
    }


    // ask the user to contiune
    inquirer.prompt([{
        type: "list",
        name: "process",
        message: "Process with folder '" + base + "' ?",
        choices: ['yes', 'no']
    }], cont);

}());
