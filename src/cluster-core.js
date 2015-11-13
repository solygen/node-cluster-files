'use strict';

let fs = require('fs'),
    pt = require('path'),
    moment = require('moment'),
    bfs = require('fs-bfs');

function extension(file) {
    var list = file.split('.');
    return list[list.length - 1];
}

module.exports = {

    process: function (basepath) {

        var data = bfs(basepath),
            hash = {};

        // move files to subfolders
        (data.files).forEach(function (data) {
            var path = data.path,
                file = data.name,
                counter = 1;

            var stats = fs.statSync(path),
                subdir = stats.mtime.toISOString().substr(0, 7),
                dir = pt.join(basepath, subdir),
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
                hash[path] = target;
            }
        });

        return hash;
    }
};
