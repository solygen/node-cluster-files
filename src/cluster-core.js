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

    process: function (options) {
        options = options || {};
        if (!options.basepath) return;

        var data = bfs(options.basepath),
            hash = {};

        // move files to subfolders
        (data.files).forEach(function (data) {
            var path = data.path,
                file = data.name,
                counter = 1,
                skipOnConflict = !options.rename && !options.overwrite;

            var stats = fs.statSync(path),
                subdir = stats.mtime.toISOString().substr(0, 7),
                dir = pt.join(options.basepath, subdir),
                target = pt.join(dir, file),
                time = moment(stats.mtime);

            if (options.rename) {
                var name = time.format('YYYY-MM-DD_HH-mm-ss') + '.' + extension(file);
                target = pt.join(dir, name);
                // fallback: add one second to filenames
                while (fs.existsSync(target)) {
                    time = time.add('s', 1);
                    name = time.format('YYYY-MM-DD_HH-mm-ss') + '.' + extension(file);
                    target = pt.join(dir, name);
                }
            }

            // skip
            if (skipOnConflict && fs.existsSync(target)) return;

            // create subdir when not existing
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);

            // rename/move
            fs.renameSync(path, target);
            hash[path] = target;
        });

        return hash;
    }
};
