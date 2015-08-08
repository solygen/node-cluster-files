//#!/usr/bin/env node
(function () {

    'use strict';

    var fs = require('fs'),
        moment = require('moment'),
        pt = require('path');

    // first cli parameter or current directory
    var base = process.argv[2] || process.cwd(),
        folders = [],
        files = {};

    if (!fs.existsSync(base)) {
        console.error('Folder ' + base +  ' does not exists');
        return;
    }

    //add base folder to queue
    folders.push(base);

    //process folders
    function read (folder) {
        var hash = {};
        if (fs.existsSync(folder)) {

            var content = fs.readdirSync(folder);

            content.forEach(function (file) {
                var path = pt.join(folder, file),
                    stats = fs.statSync(path);
                if (stats.isDirectory()) {
                    //add to folder queue
                    //folders.push(path);
                } else {
                    //add to files queue
                    files[path] = true;
                }
            });
        }
    }

    // traverse subfolders
    var i = 0;
    while (folders[i]) {
        var folder = folders[i];
        read(folder);
        i++;
    }

    function extension (file) {
        var list = file.split('.');
        return list[list.length-1];
    }

    //move files to base folder
    Object.keys(files).forEach(function (key) {
        var path = key,
            file = pt.basename(path),
            counter = 1;

        var stats = fs.statSync(key),
            subdir = stats.mtime.toISOString().substr(0,7),
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

        //create subdir
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        //rename/move
        if (!fs.existsSync(target)) {
            fs.renameSync(path, target);
            delete files[key];
        }
    });
}());
