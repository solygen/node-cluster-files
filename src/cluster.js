//#!/usr/bin/env node
'use strict';

(function () {

    let program = require('commander'),
        inquirer = require('inquirer'),
        core = require('./cluster-core');

    // define programm
    program
      .version('0.2.1')
      .usage('<path (default:current path)> [options]')
      .description('Clusters files in subdirectories based on month of creation')
      .option('-r, --rename', 'also rename files [YYYY-MM-DD_HH-mm-ss]')
      .option('-o, --overwrite', 'overwrite if file already exists (when rename is disabeld)')
      //.option('-d, --details', 'show detailed output')
      .option('-y, --yes', 'skip prompt')
      .parse(process.argv);

    // set options
    var options = {
            // parameter or current directory
            basepath: program.args[0] || process.cwd(),
            rename: program.rename,
            overwrite: program.overwrite
        };

    // skip question
    if (program.yes) return core.process(options);

    // ask the user to contiune
    inquirer.prompt([{
        type: 'list',
        name: 'process',
        message: `Process with folder ${options.basepath} ?`,
        choices: ['yes', 'no']
    }], function cont(answers) {
        if (answers.process !== 'yes') return;
        core.process(options);
    });
}());
