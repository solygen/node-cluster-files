'use strict';

var fs = require('fs'),
  pt = require('path'),
  moment = require('moment'),
  bfs = require('fs-bfs'),
  mod;

mod = {

  _getParts: function (path) {
    return pt.parse(path);
  },

  _getPath: function (file) {
    return pt.format(file);
  },

  _getTime: function (sourcefile)  {
    var stats = fs.statSync(mod._getPath(sourcefile));
    return moment(stats.mtime);
  },

  _exists: function (file) {
    return fs.existsSync(mod._getPath(file));
  },

  _setTimestampName: function (file, sourcefile) {
    var time = mod._getTime(sourcefile);
    file.name = time.format('YYYY-MM-DD_HH-mm-ss');
    file.base = file.name + file.ext;
      // fallback: add one second to timestamp
    while (mod._exists(file)) {
      time = time.add('s', 1);
      file.name = time.format('YYYY-MM-DD_HH-mm-ss');
      file.base = file.name + file.ext;
    }
  },

  process: function (options) {
    options = options || {};
    if (!options.basepath) return;

    var data = bfs(options.basepath);
    var hash = {};

    // move files to subfolders
    (data.files).forEach(function (data) {
      var sourcepath = data.path;
      var sourcefile = mod._getParts(sourcepath);
      var file = mod._getParts(sourcepath);
      var subdir = mod._getTime(sourcefile).toISOString().substr(0, 7);
      var skipOnConflict = !options.rename && !options.overwrite;

      // set target dir
      file.dir = pt.join(file.dir, subdir);

        // use creation timestamp as name
      if (options.rename) mod._setTimestampName(file, sourcefile);

        // skip
      if (skipOnConflict && mod._exists(file)) return;

        // create subdir when not existing
      if (!fs.existsSync(file.dir)) fs.mkdirSync(file.dir);

        // rename/move
      if (!options.simulate) {
        fs.renameSync(sourcepath, mod._getPath(file));
      }

      // add to hash
      var relsourc = sourcepath.replace(options.basepath, '');
      var reltarget = mod._getPath(file).replace(options.basepath, '');
      hash[relsourc] = reltarget;
    });

    return hash;
  }
};

// module expors
module.exports = mod;
