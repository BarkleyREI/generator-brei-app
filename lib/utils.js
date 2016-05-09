/*global describe, before, it*/

'use strict';

var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var path = require('path');

/**
 * TEST UTILITIES
 **/
var _set_vars = module.exports._set_vars = function(name, type) {
  var fullName = type === 'module' ?
                '_test-' + name :
                'test-' + name;

  var hbsPath = type === 'template' ?
               'app/assemble/' + fullName + '.hbs' :
               'app/assemble/' + type +'s/' + fullName + '.hbs';

  var scssPath = type === 'module' ?
                'app/sass/' + type + 's/' + fullName + '.scss' :
                'app/sass/' + type + 's/_' + fullName + '.scss';

  var hbsRegx = new RegExp('class\="test-' + name + '"');
  var scssRegx = new RegExp('\.test-' + name);

  return {
    fullName: fullName,
    hbsPath: hbsPath,
    scssPath: scssPath,
    hbsRegx: hbsRegx,
    scssRegx: scssRegx
  };
};

var _it_tests = module.exports._it_tests = function(vars) {
  it('Created ' + vars.fullName + '.hbs and ' + vars.fullName + '.scss', function() {
    assert.file([
      vars.hbsPath,
      vars.scssPath
    ]);
  });

  if (vars.fullName !== 'test-pattern-template') {
    it(vars.fullName + ' .hbs && .scss have the right content', function() {
      assert.fileContent([
        [vars.hbsPath, vars.hbsRegx],
        [vars.scssPath, vars.scssRegx]
      ]);
    });
  }
}

var _test_sub_generators = module.exports._test_sub_generators = function(name) {
  var vars = _set_vars(name, name);

  describe('Create new ' + name, function() {
    before(function subGenerator(done) {
      helpers.run(path.join(__dirname, '../generators/' + name))
        .withPrompts({
          name: 'test ' + name
        })
        .on('end', done);
    });

    _it_tests(vars);
  });
 };

var _test_patterns = module.exports._test_patterns = function(name) {
  var vars = _set_vars('pattern-' + name, name);

  describe('Import ' + name + ' Pattern', function() {
    before(function pattern(done) {
      helpers.run(path.join(__dirname, '../generators/pattern'))
        .withPrompts({
          type: name,
          name: 'test-pattern-' + name
        })
        .on('end', done);
    });

    _it_tests(vars);
  });
};

var _test_brei_main_files = module.exports._test_brei_main_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'bower.json',
    pre + 'package.json',
    pre + '.jshintrc',
    pre + '.bowerrc',
    pre + '.gitignore',
    pre + 'Gruntfile.js',
    pre + 'README.md'
  ]);

};

var _test_brei_assemble_files = module.exports._test_brei_assemble_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'app/assemble/.gitkeep',
    pre + 'app/assemble/fixtures/.gitkeep',
    pre + 'app/assemble/fixtures/default-content.json',
    pre + 'app/assemble/helpers/.gitkeep',
    pre + 'app/assemble/includes/_css-main.hbs',
    pre + 'app/assemble/includes/_fonts.hbs',
    pre + 'app/assemble/includes/_js-main.hbs',
    pre + 'app/assemble/includes/_js-modernizr.hbs',
    pre + 'app/assemble/includes/_meta.hbs',
    pre + 'app/assemble/layouts/.gitkeep',
    pre + 'app/assemble/layouts/default.hbs',
    pre + 'app/assemble/layouts/index.hbs',
    pre + 'app/assemble/layouts/module.hbs',
    pre + 'app/assemble/modules/.gitkeep',
    pre + 'app/assemble/partials/.gitkeep',
    pre + 'app/assemble/home-page.hbs',
    pre + 'app/assemble/index.hbs',
    pre + 'app/assemble/README.md'
  ]);

};

var _test_brei_helper_files = module.exports._test_brei_helper_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'app/assemble/helpers/helpers.js',
    pre + 'app/lib/updateScss.js'
  ]);

};

var _test_brei_sass_files = module.exports._test_brei_sass_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'app/sass/common/_body.scss',
    pre + 'app/sass/common/_defaults.scss',
    pre + 'app/sass/common/_forms.scss',
    pre + 'app/sass/common/_headings.scss',
    pre + 'app/sass/common/_hr.scss',
    pre + 'app/sass/common/_images.scss',
    pre + 'app/sass/common/_links.scss',
    pre + 'app/sass/common/_lists.scss',
    pre + 'app/sass/common/_selection.scss',
    pre + 'app/sass/common/_tables.scss',
    pre + 'app/sass/helpers/_access.scss',
    pre + 'app/sass/helpers/_placeholders.scss',
    pre + 'app/sass/helpers/_theme-variables.scss',
    pre + 'app/sass/helpers/color-palette/_color-map.scss',
    pre + 'app/sass/helpers/color-palette/_color.scss',
    pre + 'app/sass/helpers/lib/_animate.scss',
    pre + 'app/sass/helpers/mixins/_mixins.scss',
    pre + 'app/sass/helpers/overrides/_foundation.scss',
    pre + 'app/sass/icons/_style.scss',
    pre + 'app/sass/icons/fonts/icomoon.eot',
    pre + 'app/sass/icons/fonts/icomoon.svg',
    pre + 'app/sass/icons/fonts/icomoon.ttf',
    pre + 'app/sass/icons/fonts/icomoon.woff',
    pre + 'app/sass/icons/fonts/icomoon.woff2',
    pre + 'app/sass/icons/selection.json',
    pre + 'app/sass/icons/style.css',
    pre + 'app/sass/icons/_variables.scss',
    pre + 'app/sass/layout/_layout.scss',
    pre + 'app/sass/main.scss',
    pre + 'app/sass/modules/_assemble-modules.scss',
    pre + 'app/sass/modules/_global.scss',
    pre + 'app/sass/package.json',
    pre + 'app/sass/partials/_assemble-partials.scss',
    pre + 'app/sass/README.md',
    pre + 'app/sass/templates/_assemble-templates.scss'
  ]);

};

var _test_brei_grunt_config_files = module.exports._test_brei_grunt_config_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'grunt-config/assemble.js',
    pre + 'grunt-config/autoprefixer.js',
    pre + 'grunt-config/browserSync.js',
    pre + 'grunt-config/clean.js',
    pre + 'grunt-config/compass.js',
    pre + 'grunt-config/concurrent.js',
    pre + 'grunt-config/copy.js',
    pre + 'grunt-config/cssmin.js',
    pre + 'grunt-config/execute.js',
    pre + 'grunt-config/htmlmin.js',
    pre + 'grunt-config/imagemin.js',
    pre + 'grunt-config/jshint.js',
    pre + 'grunt-config/modernizr.js',
    pre + 'grunt-config/scsslint.js',
    pre + 'grunt-config/svgmin.js',
    pre + 'grunt-config/usemin.js',
    pre + 'grunt-config/useminPrepare.js',
    pre + 'grunt-config/watch.js'
  ]);

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

var toTitleCase = function (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var _prettify_input = module.exports._prettify_input = function (input) {

  input = input.replace('_', '');

  input = input.replace('-', ' ');

  input = toTitleCase(input);

  return input;
};


