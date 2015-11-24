'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function () {
    var testLocal;

    generators.Base.apply(this, arguments);

    // this.option('skip-welcome-message', {
    //   desc: 'Skips the welcome message',
    //   type: Boolean
    // });

    // this.option('skip-install-message', {
    //   desc: 'Skips the message after the installation of dependencies',
    //   type: Boolean
    // });

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    // this.option('babel', {
    //   desc: 'Use Babel',
    //   type: Boolean,
    //   defaults: true
    // });

    if (this.options['test-framework'] === 'mocha') {
      testLocal = require.resolve('generator-mocha/generators/app/index.js');
    } else if (this.options['test-framework'] === 'jasmine') {
      testLocal = require.resolve('generator-jasmine/generators/app/index.js');
    }

    this.composeWith(this.options['test-framework'] + ':app', {
      options: {
        'skip-install': this.options['skip-install']
      }
    }, {
      local: testLocal
    });
  },

  // initializing: function () {
  //   this.pkg = require('../package.json');
  // },

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
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

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
      this.remote('BarkleyREI', 'brei-grunt-config', 'next', function (err, remote) {
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
      this.remote('BarkleyREI', 'brei-assemble-structure', 'next', function (err, remote) {
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

      this.remote('BarkleyREI', 'brei-assemble-helpers', 'next', function (err, remote) {
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

      this.remote('BarkleyREI', 'brei-sass-boilerplate', 'next', function (err, remote) {
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

    // gruntfile: function () {
    //   this.fs.copyTpl(
    //     this.templatePath('Gruntfile.js'),
    //     this.destinationPath('Gruntfile.js'),
    //     {
    //       pkg: this.pkg,
    //       includeSass: this.includeSass,
    //       includeBootstrap: this.includeBootstrap,
    //       includeModernizr: this.includeModernizr,
    //       testFramework: this.options['test-framework'],
    //       useBabel: this.options['babel']
    //     }
    //   );
    // },

    packageJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appname: _s.slugify(this.appname),
          appversion: this.appversion
        }
      )
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      // this.fs.copy(
      //   this.templatePath('gitattributes'),
      //   this.destinationPath('.gitattributes')
      // );
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
    },

    // editorConfig: function () {
    //   this.fs.copy(
    //     this.templatePath('editorconfig'),
    //     this.destinationPath('.editorconfig')
    //   );
    // },

    // scripts: function () {
    //   this.fs.copy(
    //     this.templatePath('main.js'),
    //     this.destinationPath('app/scripts/main.js')
    //   );
    // },

    // styles: function () {
    //   var stylesheet;

    //   if (this.includeSass) {
    //     stylesheet = 'main.scss';
    //   } else {
    //     stylesheet = 'main.css';
    //   }

    //   this.fs.copyTpl(
    //     this.templatePath(stylesheet),
    //     this.destinationPath('app/styles/' + stylesheet),
    //     {
    //       includeBootstrap: this.includeBootstrap
    //     }
    //   )
    // },

    // html: function () {
    //   var bsPath;

    //   // path prefix for Bootstrap JS files
    //   if (this.includeBootstrap) {
    //     if (this.includeSass) {
    //       bsPath = '/bower_components/bootstrap-sass/assets/javascripts/bootstrap/';
    //     } else {
    //       bsPath = '/bower_components/bootstrap/js/';
    //     }
    //   }

    //   this.fs.copyTpl(
    //     this.templatePath('index.html'),
    //     this.destinationPath('app/index.html'),
    //     {
    //       appname: this.appname,
    //       includeSass: this.includeSass,
    //       includeBootstrap: this.includeBootstrap,
    //       includeModernizr: this.includeModernizr,
    //       bsPath: bsPath,
    //       bsPlugins: [
    //         'affix',
    //         'alert',
    //         'dropdown',
    //         'tooltip',
    //         'modal',
    //         'transition',
    //         'button',
    //         'popover',
    //         'carousel',
    //         'scrollspy',
    //         'collapse',
    //         'tab'
    //       ]
    //     }
    //   );
    // },

    // icons: function () {
    //   this.fs.copy(
    //     this.templatePath('favicon.ico'),
    //     this.destinationPath('app/favicon.ico')
    //   );

    //   this.fs.copy(
    //     this.templatePath('apple-touch-icon.png'),
    //     this.destinationPath('app/apple-touch-icon.png')
    //   );
    // },

    // robots: function () {
    //   this.fs.copy(
    //     this.templatePath('robots.txt'),
    //     this.destinationPath('app/robots.txt')
    //   );
    // },

    // misc: function () {
    //   mkdirp('app/images');
    //   mkdirp('app/fonts');
    // }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  },

  end: function () {
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
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

    // wire Bower packages to .html
    // wiredep({
    //   bowerJson: bowerJson,
    //   src: 'app/index.html',
    //   exclude: ['bootstrap.js'],
    //   ignorePath: /^(\.\.\/)*\.\./
    // });


      // wire Bower packages to .scss
      // wiredep({
      //   bowerJson: bowerJson,
      //   src: 'app/styles/*.scss',
      //   ignorePath: /^(\.\.\/)+/
      // });

  }
});
