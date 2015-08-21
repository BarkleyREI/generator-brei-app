/*global describe, before, it*/

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var util = require('../lib/utils.js');

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, brei-assemble-helpers, sass-boilerplate, and brei-grunt-configs.
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
    assert.file([
      'bower.json',
      'package.json',
      '.jshintrc',
      '.bowerrc',
      '.gitignore',
      'Gruntfile.js',
      'README.md'
    ]);
  });

  it('Created Assemble Files', function() {
    assert.file([
      'app/assemble/.gitkeep',
      'app/assemble/README.md',
      'app/assemble/fixtures/.gitkeep',
      'app/assemble/helpers/.gitkeep',
      'app/assemble/home-page.hbs',
      'app/assemble/index.hbs',
      'app/assemble/layouts/.gitkeep',
      'app/assemble/layouts/default.hbs',
      'app/assemble/layouts/index.hbs',
      'app/assemble/layouts/module.hbs',
      'app/assemble/modules/.gitkeep',
      'app/assemble/partials/.gitkeep',
      'app/assemble/includes/_css-main.hbs',
      'app/assemble/includes/_fonts.hbs',
      'app/assemble/includes/_js-main.hbs',
      'app/assemble/includes/_js-modernizr.hbs',
      'app/assemble/includes/_meta.hbs'
    ]);
  });

  it('Created Helper Files', function() {
    assert.file([
      'app/assemble/helpers/README.md',
      'app/assemble/helpers/helpers.js',
      'app/assemble/helpers/package.json',
      'app/assemble/helpers/updateScss.js'
    ]);
  });

  it('Created SASS Files', function() {
    assert.file([
      'app/sass/README.md',
      'app/sass/helpers/color-palette/_color-map.scss',
      'app/sass/helpers/color-palette/_color.scss',
      'app/sass/helpers/common/_body.scss',
      'app/sass/helpers/common/_defaults.scss',
      'app/sass/helpers/common/_forms.scss',
      'app/sass/helpers/common/_headings.scss',
      'app/sass/helpers/common/_hr.scss',
      'app/sass/helpers/common/_images.scss',
      'app/sass/helpers/common/_links.scss',
      'app/sass/helpers/common/_lists.scss',
      'app/sass/helpers/common/_selection.scss',
      'app/sass/helpers/common/_tables.scss',
      'app/sass/helpers/mixins/_layout.scss',
      'app/sass/helpers/lib/_normalize.scss',
      'app/sass/helpers/lib/_animate.scss',
      'app/sass/helpers/_access.scss',
      'app/sass/helpers/_mixins.scss',
      'app/sass/helpers/_placeholders.scss',
      'app/sass/helpers/_theme-variables.scss',
      'app/sass/icons/_style.scss',
      'app/sass/layout/_layout.scss',
      'app/sass/main.scss',
      'app/sass/modules/_assemble-modules.scss',
      'app/sass/modules/_global.scss',
      'app/sass/package.json',
      'app/sass/partials/_assemble-partials.scss',
      'app/sass/print/_default.scss',
      'app/sass/templates/_assemble-templates.scss'
    ]);
  });

  it('SASS directories have icomoon fonts', function() {
    assert.file([
      'app/sass/icons/fonts/icomoon.eot',
      'app/sass/icons/fonts/icomoon.svg',
      'app/sass/icons/fonts/icomoon.ttf',
      'app/sass/icons/fonts/icomoon.woff',
      'app/sass/icons/fonts/icomoon.woff2'
    ]);
  });

  it('Created Grunt Configuration Files', function(){
    assert.file([
      'grunt-config/assemble.js',
      'grunt-config/autoprefixer.js',
      'grunt-config/clean.js',
      'grunt-config/compass.js',
      'grunt-config/concurrent.js',
      'grunt-config/connect.js',
      'grunt-config/copy.js',
      'grunt-config/cssmin.js',
      'grunt-config/execute.js',
      'grunt-config/htmlmin.js',
      'grunt-config/imagemin.js',
      'grunt-config/jshint.js',
      'grunt-config/modernizr.js',
      'grunt-config/open.js',
      'grunt-config/svgmin.js',
      'grunt-config/usemin.js',
      'grunt-config/useminPrepare.js',
      'grunt-config/watch.js'
    ]);
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
  describe('Import Partial Pattern', function() {
    util._test_patterns('partial');
  });

  describe('Import Module Pattern - ', function() {
    util._test_patterns('module');
  });

  describe('Import Template Pattern', function() {
    util._test_patterns('template');
  });
});
