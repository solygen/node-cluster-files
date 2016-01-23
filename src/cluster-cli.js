#!/usr/bin/env node
'use strict';

(function () {

  var program = require('commander');
  var inquirer = require('inquirer');
  var chalk = require('chalk');
  var core = require('./cluster');
  var pjson = require('./../package.json');
  var updateNotifier = require('update-notifier');
  var cli;

  updateNotifier({ pkg: pjson }).notify();

  cli = {

    attributes: {},

    init: function () {
      // define programm
      program
        .version(pjson.version)
        .usage('<path (default:current path)> [options]')
        .description('Clusters files in subdirectories based on month of creation')
        .option('-r, --rename', 'also rename files [YYYY-MM-DD_HH-mm-ss]')
        .option('-o, --overwrite', 'overwrite if file already exists (when rename is disabeld)')
        .option('-d, --details', 'show detailed output')
        .option('-s, --simulate', 'simulate')
        .option('-y, --yes', 'skip prompt')
        .parse(process.argv);
      // add to attributes
      cli.attributes.program = program;
      return cli;
    },

    parse: function () {
      var program = cli.attributes.program;
      var options = {
        // parameter or current directory
        basepath: program.args[0] || process.cwd(),
        rename: program.rename,
        overwrite: program.overwrite,
        details: program.details,
        simulate: program.simulate,
        skipprompt: program.yes
      };
      cli.attributes.options = options;
      return cli;
    },

    process: function () {
      var options = cli.attributes.options;
      var result = core.process(options);
      cli.attributes.result = result;
      cli.output();
    },

    output: function () {
      var result = cli.attributes.result;
      var options = cli.attributes.options;
      var keys = Object.keys(result);
      // simple output
      if (options.simulate) console.log(chalk.magenta.underline.bold('SIMULATION'));

      console.log(chalk.magenta('Number of files processed: ' + keys.length));
      if (!options.details) return cli;
      // extended output
      console.log(chalk.magenta('-'));
      keys.forEach(function (key) {
        console.log(chalk.red(key));
        console.log(chalk.green(result[key]));
        console.log(chalk.magenta('-'));
      });
      return cli;
    },

    run: function () {
      var options = cli.attributes.options;
      if (options.skipprompt) return cli.process();
      cli.prompt();
      return cli;
    },

    prompt: function () {
      var options = cli.attributes.options;
      inquirer.prompt([{
        type: 'list',
        name: 'process',
        message: `Process with folder ${options.basepath} ?`,
        choices: ['yes', 'no']
      }], function cont(answers) {
        if (answers.process !== 'yes') return;
        cli.process();
      });
      return cli;
    }
  };

  cli.init().parse().run();

}());
