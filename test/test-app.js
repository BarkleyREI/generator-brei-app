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
describe('BREI-APP PROJECT GENERATOR', function(){
  describe('Main Generator', function () {
    before(function (done) {
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
        'app/assemble/partials/.gitkeep'
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
  });

  describe('Template Sub-Generator', function () {
    describe('Create new template', function() {
      before(function (done) {
        helpers.run(path.join(__dirname, '../generators/template'))
          .inDir(path.join(os.tmpdir(), './temp/template'))
          .withOptions({
            'skip-install': true
          })
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

    describe('Test updateScss.js', function() {
      it('Created no-scss.scss', function() {
        fs.writeFileSync('app/assemble/no-scss.hbs', 'no-scss');
        setTimeout(function() {
          assert.file([
            'app/assemble/no-scss.hbs',
            'app/sass/templates/no-scss.scss'
          ]);

          assert.fileContent('app/sass/templates/_assemble-templates.scss', /@import\s+"home-page";\n@import\s+"test-template.scss";\n@import\s+"no-scss";/);

        }, 100);
      });
    });
  });

  describe('Module Sub-Generator', function () {
    describe('Create new module', function() {
      before(function (done) {
        helpers.run(path.join(__dirname, '../generators/module'))
          .inDir(path.join(os.tmpdir(), './temp/module'))
          .withOptions({
            'skip-install': true
          })
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

    describe('Test updateScss.js', function() {
      it('Created no-scss.scss', function() {
        fs.writeFileSync('app/assemble/modules/_no-scss.hbs', 'no-scss');
        setTimeout(function() {
          assert.file([
            'app/assemble/modules/_no-scss.hbs',
            'app/sass/modules/_no-scss.scss'
          ]);

          assert.fileContent('app/sass/modules/_assemble-modules.scss', /@import\s+"test-module.scss";\n@import\s+"no-scss";/);

        }, 100);
      });
    });
  });

  describe('Partial Sub-Generator', function () {
    describe('Create new partial', function() {
      before(function (done) {
        helpers.run(path.join(__dirname, '../generators/partial'))
          .inDir(path.join(os.tmpdir(), './temp/partial'))
          .withOptions({
            'skip-install': true
          })
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

    describe('Test updateScss.js', function() {
      it('Created no-scss.scss', function() {
        fs.writeFileSync('app/assemble/partials/_no-scss.hbs', 'no-scss');
        setTimeout(function() {
          assert.file([
            'app/assemble/partials/no-scss.hbs',
            'app/sass/partials/_no-scss.scss'
          ]);

          assert.fileContent('app/sass/partials/_assemble-partials.scss', /@import\s+"test-partial.scss";\n@import\s+"no-scss";/);

        }, 100);
      });
    });
  });

});


