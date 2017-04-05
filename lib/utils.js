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
    pre + '.bowerrc',
    pre + '.gitignore',
	pre + '.jshintrc',
	pre + '.scss-lint.yml',
	pre + 'bower.json',
	pre + 'brei-config.json',
    pre + 'Gruntfile.js',
	pre + 'modernizr-config.json',
	pre + 'package.json',
    pre + 'post.sh',
    pre + 'README.md'
  ]);

};

var _test_brei_assemble_files = module.exports._test_brei_assemble_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'app/assemble/fixtures/default-content.json',
    pre + 'app/assemble/fixtures/global-header.json',
    pre + 'app/assemble/fixtures/global-footer.json',
    pre + 'app/assemble/includes/_access-nav.hbs',
    pre + 'app/assemble/includes/_css-main.hbs',
    pre + 'app/assemble/includes/_fonts.hbs',
    pre + 'app/assemble/includes/_js-main.hbs',
    pre + 'app/assemble/includes/_js-modernizr.hbs',
    pre + 'app/assemble/includes/_meta.hbs',
    pre + 'app/assemble/includes/_svg.hbs',
    pre + 'app/assemble/layouts/default.hbs',
    pre + 'app/assemble/layouts/index.hbs',
    pre + 'app/assemble/layouts/module.hbs',
    pre + 'app/assemble/modules/_global-footer.hbs',
    pre + 'app/assemble/modules/_global-header.hbs',
    pre + 'app/assemble/partials/logo.hbs',
    pre + 'app/assemble/home-page.hbs',
    pre + 'app/assemble/index.hbs'
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
    pre + 'app/sass/layout/_layout.scss',
    pre + 'app/sass/main.scss',
    pre + 'app/sass/modules/_assemble-modules.scss',
    pre + 'app/sass/modules/_global.scss',
    pre + 'app/sass/partials/_assemble-partials.scss',
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

var _test_brei_grunt_built_files = module.exports._test_brei_grunt_built_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'app/index.html',
    pre + 'app/home-page.html',
	pre + 'app/js/plugins/modernizr.js',
    pre + 'dist/index.html',
    pre + 'dist/home-page.html',
    pre + 'dist/css/main.css',
    pre + 'dist/js/main.js',
    pre + 'dist/js/plugins/modernizr.optimized.js',
    pre + 'web/index.html',
    pre + 'web/home-page.html',
    pre + 'web/css/main.css',
    pre + 'web/js/main.js',
    pre + 'web/js/plugins/modernizr.optimized.js'
  ]);

};

var _test_brei_grunt_execute_files = module.exports._test_brei_grunt_execute_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'app/sass/modules/_assemble-modules.scss',
    pre + 'app/sass/partials/_assemble-partials.scss',
    pre + 'app/sass/templates/_assemble-templates.scss'
  ]);

};

var _test_brei_generator_files = module.exports._test_brei_generator_files = function (prefix) {

  var pre = '';
  if (typeof prefix !== undefined && prefix !== '') {
    pre = prefix;
  }

  assert.file([
    pre + 'generators/app/index.js',
    pre + 'generators/module/index.js',
    pre + 'generators/module/templates/module.hbs',
    pre + 'generators/module/templates/module.json',
    pre + 'generators/module/templates/module.scss',
    pre + 'generators/new/index.js',
    pre + 'generators/new/templates/',
    pre + 'generators/new/templates/_bower.json',
    pre + 'generators/new/templates/_brei-config.json',
    pre + 'generators/new/templates/_modernizr-config.json',
    pre + 'generators/new/templates/_package.json',
    pre + 'generators/new/templates/bowerrc',
    pre + 'generators/new/templates/gitignore',
    pre + 'generators/new/templates/gitkeep',
    pre + 'generators/new/templates/jshintrc',
    pre + 'generators/new/templates/modernizr.js',
    pre + 'generators/new/templates/postsh',
    pre + 'generators/new/templates/README.md',
    pre + 'generators/new/templates/rocket.png',
    pre + 'generators/new/templates/scss-lint.yml',
    pre + 'generators/partial/index.js',
    pre + 'generators/partial/templates/partial.hbs',
    pre + 'generators/partial/templates/partial.scss',
    pre + 'generators/template/index.js',
    pre + 'generators/template/templates/template.hbs',
    pre + 'generators/template/templates/template.json',
    pre + 'generators/template/templates/template.scss',
    pre + 'lib/utils.js',
    pre + 'test/mocha.opts',
    pre + 'test/test-app.js',
    pre + 'test/test-utils.js',
    pre + 'package.json',
    pre + 'README.md'
  ]);

}

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
