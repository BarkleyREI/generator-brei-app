'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function () {

    generators.Base.apply(this, arguments);

  },

  askFor: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'Name of Client (e.g. NOVA, Corpus, Times Square NYC)',
      default: 'static'
    }, {
      type: 'input',
      name: 'appversion',
      message: 'Version of App',
      default: '0.0.1'
    }, {
      type: 'input',
      name: 'deployDirectory',
      message: 'Deploy directory (relative to current path)',
      default: '../../web'
    }];

    this.prompt(prompts, function (answers) {
      // var features = answers.features;

      // function hasFeature(feat) {
      //  return features && features.indexOf(feat) !== -1;
      // }

      // this.includeSass = hasFeature('includeSass');
      // this.includeBootstrap = hasFeature('includeBootstrap');
      // this.includeModernizr = hasFeature('includeModernizr');
      // this.includeJQuery = answers.includeJQuery;

      this.appname = answers.appname;
      this.appversion = answers.appversion;
      this.deployDirectory = answers.deployDirectory;

      done();
    }.bind(this));
  },

  writing: {

    folders: function () {

      mkdirp('app');
      // All the grunt configuration files
      mkdirp('grunt-config');
      // Assembled HTML
      mkdirp('app/modules');
      // Compiled CSS
      mkdirp('app/css');
      // Your scripts
      mkdirp('app/js');
      mkdirp('app/js/plugins');
      mkdirp('app/js/modules');
      mkdirp('app/js/lib');
      // Images
      mkdirp('app/img');

    },

    gruntConfig: function () {
      var cb = this.async();

      // Directory Structure
      this.remote('BarkleyREI', 'brei-grunt-config', 'master', function (err, remote) {
        if (err) {
          console.log('--ERROR WHILE GETTING GRUNT CONFIGS!!', err);
          return cb(err);
        }

        remote.directory('grunt-config', 'grunt-config');
        remote.copy('Gruntfile.js', 'Gruntfile.js');

        cb();
      }, true);
    },

    assemble: function () {
      var cb = this.async();

      // Directory Structure
      this.remote('BarkleyREI', 'brei-assemble-structure', 'master', function (err, remote) {
        if (err) {
          console.log('--ERROR WHILE GETTING ASSEMBLE STRUCTURE!!', err);
          return cb(err);
        }

        remote.directory('.', 'app/assemble');

        cb();
      }, true);
    },

    helpers: function () {
      var cb = this.async();

      this.remote('BarkleyREI', 'brei-assemble-helpers', 'master', function (err, remote) {
        if (err) {
          console.log('--ERROR WHILE GETTING HELPERS!!', err);
          return cb(err);
        }

        remote.directory('.', 'app/assemble/helpers');

        cb();
      }, true);
    },

    sass: function () {
      var cb = this.async();

      this.remote('BarkleyREI', 'brei-sass-boilerplate', 'master', function (err, remote) {
        if (err) {
          console.log('--ERROR WHILE GETTING SASS!!', err);
          return cb(err);
        }

        remote.directory('.', 'app/sass');

        cb();
      }, true);
    },

    mixins: function () {
      var cb = this.async();

      this.remote('BarkleyREI', 'brei-sass-mixins', 'master', function (err, remote) {
        if (err) {
          console.log('--ERROR WHILE GETTING MIXINS!!', err);
          return cb(err);
        }

        remote.directory('.', 'app/sass/helpers/mixins');

        cb();
      }, true);
    },

    projectFiles: function () {
      this.fs.copyTpl(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc'),
        {}
      );

      this.fs.copyTpl(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc'),
        {}
      );

      this.fs.copyTpl(
        this.templatePath('scss-lint.yml'),
        this.destinationPath('.scss-lint.yml'),
        {}
      );
    },

    readme: function () {

      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        {
          appname: _s.slugify(this.appname)
        }
      );

    },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appname: _s.slugify(this.appname),
          appversion: this.appversion
        }
      );
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    bower: function () {
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {
          appname: _s.slugify(this.appname),
          appversion: this.appversion
        }
      );
    }

  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  },

  end: function () {

    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('grunt wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

  }
});
