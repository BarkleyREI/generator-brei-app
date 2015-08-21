'use strict';

var yeoman = require('yeoman-generator');

var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
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

		this.prompt(prompts, function (props) {
			this.someOption = props.someOption;

			var appname = props.appname;
			var appversion = props.appversion;
			var deployDirectory = props.deployDirectory;

			this.appname = appname;
			this.appversion = appversion;
			this.deployDirectory = deployDirectory;

			done();
		}.bind(this));
	},

	writing: {
		folders: function () {
			this.dest.mkdir('app');
			// All the grunt configuration files
			this.dest.mkdir('grunt-config');
			// Assembled HTML
			this.dest.mkdir('app/modules');
			// Compiled CSS
			this.dest.mkdir('app/css');
			// Your scripts
			this.dest.mkdir('app/js');
			this.dest.mkdir('app/js/plugins');
			this.dest.mkdir('app/js/modules');
			this.dest.mkdir('app/js/lib');
			// Images
			this.dest.mkdir('app/img');
		},

		app: function () {
			this.template('_package.json', 'package.json');
			this.template('_bower.json', 'bower.json');
			this.template('_scss-lint.yml', '.scss-lint.yml');
			this.template('README.md', 'README.md');
			this.template('gitignore', '.gitignore');

			// Add .gitkeep file to maintain file structure
			this.src.copy('gitkeep', 'app/js/plugins/.gitkeep');
			this.src.copy('gitkeep', 'app/js/modules/.gitkeep');
			this.src.copy('gitkeep', 'app/js/lib/.gitkeep');

			this.src.copy('rocket.png', 'app/img/rocket.png');
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
				remote.template('Gruntfile.js', 'Gruntfile.js');

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

			this.remote('BarkleyREI', 'sass_boilerplate', 'master', function (err, remote) {
				if (err) {
					console.log('--ERROR WHILE GETTING SASS!!', err);
					return cb(err);
				}

				remote.directory('.', 'app/sass');

				cb();
			}, true);
		},

		sassLint: function () {
			this.src.copy('_scss-lint.yml', 'scss-lint.yml');
		},

		projectfiles: function () {
			this.src.copy('jshintrc', '.jshintrc');
			this.src.copy('bowerrc', '.bowerrc');
		}
	},

	end: function () {
		this.installDependencies();
		this.config.save();
	}

});

module.exports = BreiAppGenerator;
