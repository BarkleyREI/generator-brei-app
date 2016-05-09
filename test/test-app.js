/*global describe, before, it*/

'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');
var util = require('../lib/utils.js');

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, brei-assemble-helpers, brei-sass-boilerplate, and brei-grunt-configs.
 */
describe('Main Generator', function () {
  before(function mainGenerator(done) {
    helpers.run(path.join(__dirname, '../generators/new'))
      .inDir(path.join(os.tmpdir(), './temp'))
      .withOptions({
        'skip-install': true
      })
      .on('end', done);
  });

  it('Created Main Files', function () {
    util._test_brei_main_files('');
  });

  it('Created Assemble Files', function () {
    util._test_brei_assemble_files('');
  });

  it('Created Helper Files', function () {
    util._test_brei_helper_files('');
  });

  it('Created SASS Files', function () {
    util._test_brei_sass_files('');
  });

  it('Created Grunt Configuration Files', function () {
    util._test_brei_grunt_config_files('');
  });
});

describe('Update Sub-Generator', function () {
  before(function mainGenerator(done) {
    helpers.run(path.join(__dirname, '../generators/update'))
      .inDir(path.join(os.tmpdir(), './temp/static'))
      .withOptions({
        'skip-warning': true
      })
      .on('end', done);
  });

  it('Update - Created Main Files', function () {
    util._test_brei_main_files('../_update/');
  });

  it('Update - Created Assemble Files', function () {
    util._test_brei_assemble_files('../_update/');
  });

  it('Update - Created Helper Files', function () {
    util._test_brei_helper_files('../_update/');
  });

  it('Update - Created SASS Files', function () {
    util._test_brei_sass_files('../_update/');
  });

  it('Update - Created Grunt Configuration Files', function () {
    util._test_brei_grunt_config_files('../_update/');
  });
});

describe('Template Sub-Generator', function () {
  util._test_sub_generators('template');
});

describe('Module Sub-Generator - ', function () {
  util._test_sub_generators('module');
});

describe('Partial Sub-Generator - ', function () {
  util._test_sub_generators('partial');
});

describe('Pattern Library Sub-Generator - ', function () {
  describe('Import Partial Pattern', function () {
    util._test_patterns('partial');
  });

  describe('Import Module Pattern - ', function () {
    util._test_patterns('module');
  });

  describe('Import Template Pattern', function () {
    util._test_patterns('template');
  });
});


