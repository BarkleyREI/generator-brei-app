'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the BarkleyREI project generator! Comes with HTML5 Boilerplate, SASS, jQuery (2.x), Assemble.io, Modernizr, Foundation, and autoprefixer.'
		));
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
			default: '../../deploy'
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
			this.template('Gruntfile.js', 'Gruntfile.js');
			this.template('README.md', 'README.md');
			this.template('gitignore', '.gitignore');

			// Add .gitkeep file to maintain file structure
			this.src.copy('gitkeep', 'app/js/plugins/.gitkeep');
			this.src.copy('gitkeep', 'app/js/modules/.gitkeep');
			this.src.copy('gitkeep', 'app/js/lib/.gitkeep');

			this.src.copy('rocket.png', 'app/img/rocket.png');
		},

		gruntConfig: function () {
			this.src.copy('grunt-config/assemble.js', 'grunt-config/assemble.js');
			this.src.copy('grunt-config/autoprefixer.js', 'grunt-config/autoprefixer.js');
			this.src.copy('grunt-config/clean.js', 'grunt-config/clean.js');
			this.src.copy('grunt-config/compass.js', 'grunt-config/compass.js');
			this.src.copy('grunt-config/concurrent.js', 'grunt-config/concurrent.js');
			this.src.copy('grunt-config/connect.js', 'grunt-config/connect.js');
			this.src.copy('grunt-config/copy.js', 'grunt-config/copy.js');
			this.src.copy('grunt-config/cssmin.js', 'grunt-config/cssmin.js');
			this.src.copy('grunt-config/execute.js', 'grunt-config/execute.js');
			this.src.copy('grunt-config/htmlmin.js', 'grunt-config/htmlmin.js');
			this.src.copy('grunt-config/imagemin.js', 'grunt-config/imagemin.js');
			this.src.copy('grunt-config/jshint.js', 'grunt-config/jshint.js');
			this.src.copy('grunt-config/modernizr.js', 'grunt-config/modernizr.js');
			this.src.copy('grunt-config/open.js', 'grunt-config/open.js');
			this.src.copy('grunt-config/svgmin.js', 'grunt-config/svgmin.js');
			this.src.copy('grunt-config/usemin.js', 'grunt-config/usemin.js');
			this.src.copy('grunt-config/useminPrepare.js', 'grunt-config/useminPrepare.js');
			this.src.copy('grunt-config/watch.js', 'grunt-config/watch.js');
			this.src.copy('grunt-config/yeoman.js', 'grunt-config/yeoman.js');
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
