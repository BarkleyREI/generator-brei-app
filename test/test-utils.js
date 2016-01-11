/*global describe, before, it*/

'use strict';

var util = require('../lib/utils.js');
var assert = require('yeoman-assert');
var fs = require('fs');

describe('Testing Util _format_input()', function() {
  context('test name', function() {
    it('= test-name', function() {
      var input = util._format_input('test name');
      assert.textEqual(input, 'test-name');
    });
  });
  context('test_name', function() {
    it('= test-name', function() {
      var input = util._format_input('test_name');
      assert.textEqual(input, 'test-name');
    });
  });
  context('_test_name', function() {
    it('= test-name', function() {
      var input = util._format_input('_test_name');
      assert.textEqual(input, 'test-name');
    });
  });
  context('--test-name.hbs', function() {
    it('= test-name', function() {
      var input = util._format_input('--test-name.hbs');
      assert.textEqual(input, 'test-name');
    });
  });
  context('__test-name.hbs', function() {
    it('= test-name', function() {
      var input = util._format_input('__test-name.hbs');
      assert.textEqual(input, 'test-name');
    });
  });
  context('__test-name.hbs--', function() {
    it('= test-name', function() {
      var input = util._format_input('__test-name.hbs--');
      assert.textEqual(input, 'test-name');
    });
  });
  context('__test-name.hbs -- kd', function() {
    it('= test-name', function() {
      var input = util._format_input('__test-name.hbs -- kd');
      assert.textEqual(input, 'test-name');
    });
  });
});

describe('Test updateScss.js', function() {
  it('Created no-scss.scss', function() {
    fs.writeFile('app/assemble/no-scss.hbs', 'no-scss', function(err) {
      if (err) { throw err; }

      assert.file([
        'app/assemble/no-scss.hbs',
        'app/sass/templates/_no-scss.scss'
      ]);

      assert.fileContent('app/sass/templates/_assemble-templates.scss', /@import\s+"home-page";\n@import\s+"test-template.scss";\n@import\s+"no-scss";/);
    });
  });
});
