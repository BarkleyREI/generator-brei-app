/*global describe, before, it, require, __dirname*/

var path = require('path');
var helpers = require('yeoman-test');
var os = require('os');
var util = require('../lib/utils.js');
var exec = require('child_process').exec;

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, brei-assemble-helpers, brei-sass-boilerplate, and brei-grunt-configs.
 */
describe('Main Generator', function () {
  'use strict';

  before(function mainGenerator(done) {
    var tdir = path.join(os.tmpdir(), './temp');
    this.timeout(240000);

    console.log('\n\n Running a generator with npm install. This might take a while...\n\n');

    helpers.run(path.join(__dirname, '../generators/new'))
      .inDir(tdir)
      .withOptions({
        'skip-install': false
      })
      .withPrompts({
        'deployDirectory': 'web'
      })
      .on('end', function () {

        console.log('\nRunning grunt and grunt deploy');
        console.log('------------');
        console.log('Buckle up, this might take 45 - 60 seconds\n');

        exec('grunt build && grunt deploy', {
          cwd: tdir
        }, function () {
          done();
        });

      });
  });

  it('Ran grunt to build out directories', function () {
    var tdir = path.join(os.tmpdir(), './temp/');
    util._test_brei_grunt_built_files(tdir);
  });

  it('Grunt execute ran successfully', function () {
    var tdir = path.join(os.tmpdir(), './temp/');
    util._test_brei_grunt_execute_files(tdir);
  });

  it('Created Main Files', function () {
    var tdir = path.join(os.tmpdir(), './temp/');
    util._test_brei_main_files(tdir);
  });

  it('Created Assemble Files', function () {
    var tdir = path.join(os.tmpdir(), './temp/');
    util._test_brei_assemble_files(tdir);
  });

  it('Created Helper Files', function () {
    var tdir = path.join(os.tmpdir(), './temp/');
    util._test_brei_helper_files(tdir);
  });

  it('Created SASS Files', function () {
    var tdir = path.join(os.tmpdir(), './temp/');
    util._test_brei_sass_files(tdir);
  });

  it('Created Grunt Configuration Files', function () {
    var tdir = path.join(os.tmpdir(), './temp/');
    util._test_brei_grunt_config_files(tdir);
  });
});

describe('Check Generator Files', function () {
  'use strict';

  it('Generator self check', function () {
    var dir = path.join(__dirname, '../');
    util._test_brei_generator_files(dir);
  });
});

// describe('Update Sub-Generator', function () {
//   'use strict';
//
//   before(function mainGenerator(done) {
//     helpers.run(path.join(__dirname, '../generators/update'))
//       .inDir(path.join(os.tmpdir(), './temp/static'))
//       .withOptions({
//         'skip-warning': true
//       })
//       .on('end', done);
//   });
//
//   it('Update - Created Main Files', function () {
//     util._test_brei_main_files('../_update/');
//   });
//
//   it('Update - Created Assemble Files', function () {
//     util._test_brei_assemble_files('../_update/');
//   });
//
//   it('Update - Created Helper Files', function () {
//     util._test_brei_helper_files('../_update/');
//   });
//
//   it('Update - Created SASS Files', function () {
//     util._test_brei_sass_files('../_update/');
//   });
//
//   it('Update - Created Grunt Configuration Files', function () {
//     util._test_brei_grunt_config_files('../_update/');
//   });
// });

describe('Template Sub-Generator', function () {
  'use strict';
  util._test_sub_generators('template');
});

describe('Module Sub-Generator - ', function () {
  'use strict';
  util._test_sub_generators('module');
});

describe('Partial Sub-Generator - ', function () {
  'use strict';
  util._test_sub_generators('partial');
});

// describe('Pattern Library Sub-Generator - ', function () {
//   'use strict';
//   describe('Import Partial Pattern', function () {
//     util._test_patterns('partial');
//   });
//
//   describe('Import Module Pattern - ', function () {
//     util._test_patterns('module');
//   });
//
//   describe('Import Template Pattern', function () {
//     util._test_patterns('template');
//   });
// });
