var generators = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var optional = require('optional');
var _s = require('underscore.string');
var _brei = require('../../config/brei-config.json');
var yosay = require('yosay');
var remote = require('yeoman-remote');
var path = require('path');

module.exports = generators.Base.extend({

  constructor: function () {

    generators.Base.apply(this, arguments);

    this.pkg = require('../../package.json');

    this.github = "BarkleyREI";

    if (_brei != null) {
      if (_brei.github != null) {
        this.github = _brei.github;
      }
    }

    debugger;

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
      // ES6 scripts
      mkdirp('app/js/es6');
      mkdirp('app/js/es6/plugins');
      mkdirp('app/js/es6/modules');
      mkdirp('app/js/es6/lib');
      // Images
      mkdirp('app/img');

    },

    gruntConfig: function () {
      var cb = this.async();

      // Directory Structure
      this.remote(this.github, 'brei-grunt-config', 'master', function (err, remote) {
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
      this.remote(this.github, 'brei-assemble-structure', 'master', function (err, remote) {
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

      this.remote(this.github, 'brei-assemble-helpers', 'master', function (err, remote) {
        if (err) {
          console.log('--ERROR WHILE GETTING HELPERS!!', err);
          return cb(err);
        }

        remote.copy('./helpers.js', 'app/assemble/helpers/helpers.js');
        remote.copy('./updateScss.js', 'app/lib/updateScss.js');

        cb();
      }, true);
    },

    sass: function () {
      var cb = this.async();

      this.remote(this.github, 'brei-sass-boilerplate', 'master', function (err, remote) {
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

      this.remote(this.github, 'brei-sass-mixins', 'master', function (err, remote) {
        if (err) {
          console.log('--ERROR WHILE GETTING MIXINS!!', err);
          return cb(err);
        }

        remote.directory('.', 'app/sass/helpers/mixins');

        cb();
      }, true);
    },

    modernizr: function () {

      this.fs.copyTpl(
        this.templatePath('modernizr.js'),
        this.destinationPath('app/js/plugins/modernizr.js'),
        {}
      );

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

    breiJSON: function () {
      this.fs.copyTpl(
        this.templatePath('_brei-config.json'),
        this.destinationPath('brei-config.json'),
        {
          genver: this.pkg.version,
          appname: _s.slugify(this.appname),
          appversion: this.appversion,
          deployDirectory: this.deployDirectory,
          debug: "false"
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
      this.fs.copyTpl(
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

    if (this.options['skip-install']) {
      this.log(yosay(
        'Make sure to run `npm install` and `bower install` to install all your dependencies! Happy coding!\n\n' +
        'Generated with v' + this.pkg.version
      ));
    } else {
      this.log(yosay(
        'Happy coding!\n\n' +
        'Generated with v' + this.pkg.version
      ));
    }

    return;

  }
=======
=======
>>>>>>> BarkleyREI/master
	constructor: function () {

		generators.Base.apply(this, arguments);

		this.pkg = require('../../package.json');

		this.github = "BarkleyREI";
		this.genver = this.pkg['version'];
		this.debug = 'false';

		if (_brei !== null) {
			if (_brei.github !== null) {
				this.github = _brei.github;
			}
		}

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

		return this.prompt(prompts).then(function (answers) {
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
			remote(this.github, 'brei-grunt-config', 'master', function (err, cachePath) {
				if (err) {
					console.log('--ERROR WHILE GETTING GRUNT CONFIGS!!', err);
					return cb(err);
				}

				this.directory(path.join(cachePath, 'grunt-config'), 'grunt-config');
				this.copy(
					path.join(cachePath, 'Gruntfile.js'),
					this.destinationPath('Gruntfile.js'),
					{}
				);

				cb();
			}.bind(this), true);
		},

		assemble: function () {
			var cb = this.async();

			// Directory Structure
			remote(this.github, 'brei-assemble-structure', 'master', function (err, cachePath) {
				if (err) {
					console.log('--ERROR WHILE GETTING ASSEMBLE STRUCTURE!!', err);
					return cb(err);
				}

				this.directory(cachePath, 'app/assemble');

				cb();
			}.bind(this), true);
		},

		helpers: function () {
			var cb = this.async();

			remote(this.github, 'brei-assemble-helpers', 'master', function (err, cachePath) {
				if (err) {
					console.log('--ERROR WHILE GETTING HELPERS!!', err);
					return cb(err);
				}

				this.copy(
					path.join(cachePath, 'helpers.js'),
					this.destinationPath('app/assemble/helpers/helpers.js'),
					{}
				);
				this.copy(
					path.join(cachePath, 'updateScss.js'),
					this.destinationPath('app/lib/updateScss.js'),
					{}
				);

				cb();
			}.bind(this), true);
		},

		sass: function () {
			var cb = this.async();

			remote(this.github, 'brei-sass-boilerplate', 'master', function (err, cachePath) {
				if (err) {
					console.log('--ERROR WHILE GETTING SASS!!', err);
					return cb(err);
				}

				this.directory(cachePath, 'app/sass');

				cb();
			}.bind(this), true);
		},

		mixins: function () {
			var cb = this.async();

			remote(this.github, 'brei-sass-mixins', 'master', function (err, cachePath) {
				if (err) {
					console.log('--ERROR WHILE GETTING MIXINS!!', err);
					return cb(err);
				}

				this.directory(cachePath, 'app/sass/helpers/mixins');

				cb();
			}.bind(this), true);
		},

		modernizrJSON: function () {
			this.fs.copyTpl(
				this.templatePath('_modernizr-config.json'),
				this.destinationPath('modernizr-config.json'),
				{}
			);
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

		breiJSON: function () {
			this.fs.copyTpl(
				this.templatePath('_brei-config.json'),
				this.destinationPath('brei-config.json'),
				{
					genver: this.genver,
					appname: _s.slugify(this.appname),
					appversion: this.appversion,
					deployDirectory: this.deployDirectory,
					debug: this.debug
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
			this.fs.copyTpl(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json'),
				{
					appname: _s.slugify(this.appname),
					appversion: this.appversion
				}
			);
		},

		shell: function () {
			this.fs.copyTpl(
				this.templatePath('postsh'),
				this.destinationPath('post.sh'),
				{}
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

		if (this.options['skip-install']) {
			this.log(yosay(
				'Make sure to run `npm install` and `bower install` to install all your dependencies! Happy coding!\n\n' +
				'Generated with v' + this.pkg.version
			));
		} else {
			this.log(yosay(
				'Happy coding!\n\n' +
				'Generated with v' + this.pkg.version
			));
		}

		return;

	}
	
});
