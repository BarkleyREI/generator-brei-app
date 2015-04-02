/*global describe, before, it*/

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var fs = require('fs');

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, and brei-assemble-helpers.
 */

describe('Main Generator', function () {
  before(function mainGenerator(done) {
    helpers.run(path.join(__dirname, '../generators/app'))
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
      'app/sass/helpers/_access.scss',
      'app/sass/helpers/_animate.scss',
      'app/sass/helpers/_common.scss',
      'app/sass/helpers/_mixins.scss',
      'app/sass/helpers/_normalize.scss',
      'app/sass/helpers/_theme-variables.scss',
      'app/sass/helpers/color-palette/_color-map.scss',
      'app/sass/helpers/color-palette/_color.scss',
      'app/sass/helpers/mixins/_layout-mixins.scss',
      'app/sass/helpers/mixins/_margin.scss',
      'app/sass/helpers/mixins/_padding.scss',
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
  describe('Create new template', function() {
    before(function template(done) {
      helpers.run(path.join(__dirname, '../generators/template'))
        .withPrompt({
          templateName: 'test template'
        })
        .on('end', done);
    });

    it('Created test-template.hbs and test-template.scss', function() {
      assert.file([
        'app/assemble/test-template.hbs',
        'app/sass/templates/test-template.scss'
      ]);
    });

    it('Test-template .hbs && .scss have the right content', function() {
      assert.fileContent([
        ['app/assemble/test-template.hbs', /title\:\stest-template|\s+test-template/],
        ['app/sass/templates/test-template.scss', /\.test-template {\n\s+\/\/ Awesome styles\n}/]
      ]);
    });
  });
});

describe('Module Sub-Generator - ', function () {
  describe('Create new module', function() {
    before(function module(done) {
      helpers.run(path.join(__dirname, '../generators/module'))
        .withPrompt({
          moduleName: 'test module'
        })
        .on('end', done);
    });

    it('Created _test-module.hbs and _test-module.scss', function() {
      assert.file([
        'app/assemble/modules/_test-module.hbs',
        'app/sass/modules/_test-module.scss'
      ]);
    });

    it('Test-module .hbs && .scss have the right content', function() {
      assert.fileContent([
        ['app/assemble/modules/_test-module.hbs', /title\:\stest-module|\s+test-module/],
        ['app/sass/modules/_test-module.scss', /\.test-module {\n\s+\/\/\sAwesome styles\n}/]
      ]);
    });
  });
});

describe('Partial Sub-Generator - ', function () {
  describe('Create new partial', function() {
    before(function partial(done) {
      helpers.run(path.join(__dirname, '../generators/partial'))
        .withPrompt({
          partialName: 'test partial'
        })
        .on('end', done);
    });

    it('Created test-partial.hbs and _test-partial.scss', function() {
      assert.file([
        'app/assemble/partials/test-partial.hbs',
        'app/sass/partials/_test-partial.scss'
      ]);
    });

    it('Test-partial .hbs && .scss have the right content', function() {
      assert.fileContent([
        ['app/assemble/partials/test-partial.hbs', /title\:\stest-partial|\s+test-partial/],
        ['app/sass/partials/_test-partial.scss', /\.test-partial {\n\s+\/\/\sAwesome styles\n}/]
      ]);
    });
  });
});

describe('Pattern Library Sub-Generator - ', function () {
  describe('Import Partial Pattern', function() {
    before(function partialPattern(done) {
      helpers.run(path.join(__dirname, '../generators/pattern'))
        .withPrompt({
          type: 'partials',
          name: 'test pattern partial'
        })
        .on('end', done);
    });

    it('Created test-partial.hbs and _test-partial.scss - ', function() {
      assert.file([
        'app/assemble/partials/test-pattern-partial.hbs',
        'app/sass/partials/_test-pattern-partial.scss'
      ]);
    });

    it('Test-pattern-partial .hbs && .scss have the right content - ', function() {
      assert.fileContent([
        ['app/assemble/partials/test-pattern-partial.hbs', /class\="test-pattern-partial"/g],
        ['app/sass/partials/_test-pattern-partial.scss', /\.test-pattern-partial/g]
      ]);
    });
  });

  describe('Import Module Pattern - ', function() {
    before(function modulePattern(done) {
      helpers.run(path.join(__dirname, '../generators/pattern'))
        .withPrompt({
          type: 'modules',
          name: 'test pattern module'
        })
        .on('end', done);
    });

    it('Created test-pattern-module.hbs and _test-pattern-module.scss - ', function() {
      assert.file([
        'app/assemble/modules/_test-pattern-module.hbs',
        'app/sass/modules/_test-pattern-module.scss'
      ]);
    });

    it('Test-pattern-modules .hbs && .scss have the right content - ', function() {
      assert.fileContent([
        ['app/assemble/modules/_test-pattern-module.hbs', /title\:\s"test-pattern-module"/g],
        ['app/sass/modules/_test-pattern-module.scss', /\.test-pattern-module/g]
      ]);
    });
  });

  describe('Import Template Pattern', function() {
    before(function templatePattern(done) {
      helpers.run(path.join(__dirname, '../generators/pattern'))
        .withPrompt({
          type: 'template',
          name: 'test pattern template'
        })
        .on('end', done);
    });

    it('Created test-pattern-template.hbs and _test-pattern-template.scss', function() {
      assert.file([
        'app/assemble/test-pattern-template.hbs',
        'app/sass/templates/_test-pattern-template.scss'
      ]);
    });

    it('Test-pattern-template .hbs && .scss have the right content', function() {
      assert.fileContent([
        ['app/assemble/test-pattern-template.hbs', /title\:\sTest\sPattern\sTemplate/g],
        ['app/sass/templates/_test-pattern-template.scss', /\.test-pattern-template/g]
      ]);
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
