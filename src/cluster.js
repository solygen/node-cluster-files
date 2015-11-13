//#!/usr/bin/env node
'use strict';

(function () {

    let inquirer = require('inquirer'),
        core = require('./cluster-core');

    // first cli parameter or current directory
    var base = process.argv[2] || process.cwd();

    function cont(answers) {
        if (answers.process !== 'yes') return;
        core.process(base);
    }

    // ask the user to contiune
    inquirer.prompt([{
        type: 'list',
        name: 'process',
        message: `Process with folder ${base} ?`,
        choices: ['yes', 'no']
    }], cont);
}());
