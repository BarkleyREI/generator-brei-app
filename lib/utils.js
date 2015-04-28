/*global describe, before, it*/

'use strict';

var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var path = require('path');

/**
 * TEST UTILITIES
 **/
var _set_vars = module.exports._set_vars = function(name) {
  var fullName = name === 'module' ?
                '_test-' + name :
                'test-' + name;

  var hbsPath = name === 'template' ?
               'app/assemble/' + fullName + '.hbs' :
               'app/assemble/' + name +'s/' + fullName + '.hbs';

  var scssPath = name === 'module' ?
                'app/sass/' + name + 's/' + fullName + '.scss' :
                'app/sass/' + name + 's/_' + fullName + '.scss';

  var hbsRegx = new RegExp('class\="test-' + name + '"');
  var scssRegx = new RegExp('\.test-' + name);

  return {
    fullName: fullName,
    hbsPath: hbsPath,
    scssPath: scssPath,
    hbsRegx: hbsRegx,
    scssRegx: scssRegx
  }
};

var _it_tests = module.exports._it_tests = function(vars) {
  it('Created ' + vars.fullName + '.hbs and ' + vars.fullName + '.scss', function() {
    assert.file([
      vars.hbsPath,
      vars.scssPath
    ]);
  });

  it(vars.fullName + ' .hbs && .scss have the right content', function() {
    assert.fileContent([
      [vars.hbsPath, vars.hbsRegx],
      [vars.scssPath, vars.scssRegx]
    ]);
  });
}

var _test_sub_generators = module.exports._test_sub_generators = function(name) {
  var vars = _set_vars(name);

  describe('Create new ' + name, function() {
    before(function subGenerator(done) {
      helpers.run(path.join(__dirname, '../generators/' + name))
        .withPrompt({
          name: 'test ' + name
        })
        .on('end', done);
    });

    _it_tests(vars);
  });
 };

var _test_patterns = module.exports._test_patterns = function(name) {
  var vars = _set_vars(name);

  describe('Import ' + name + ' Pattern', function() {
    before(function pattern(done) {
      helpers.run(path.join(__dirname, '../generators/pattern'))
        .withPrompt({
          type: name,
          name: 'test-pattern-' + name
        })
        .on('end', done);
    });

    _it_tests(vars);
  });
};

/**
 * GENERATOR UTILITIES
 **/
var _format_input = module.exports._format_input = function(input) {
  // Remove the first _ (or __)
  if (/^_/g.test(input)) {
    input = input.replace(/^_+/g, '');
  }
  // Remove the first _ (or __)
  if (/^-/g.test(input)) {
    input = input.replace(/^-+/g, '');
  }
  // Change all whitespace to -
  if (/\s/g.test(input)) {
    input = input.replace(/\s/g, '-');
  }
  // Change all remaining _ to -
  if (/_/g.test(input)) {
    input = input.replace(/_/g, '-');
  }
  // Remove any file extensions
  if (/\..+/g.test(input)) {
    input = input.replace(/\..+/g, '');
  }
  // Remove any trailing -- or __
  if (/\s+$|-+$|_+$/.test(input)) {
    input = input.replace(/\s+$|-+$|_+$/g, '');
  }

  return input;
};