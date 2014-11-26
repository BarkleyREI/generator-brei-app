'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var brei = require('brei-junk');

var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the BarkleyREI project generator! Comes with HTML5 Boilerplate, SASS, jQuery (2.x), Modernizr, Foundation, and autoprefixer'
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
		app: function () {
			this.dest.mkdir('app');
			this.dest.mkdir('app/modules');
			this.dest.mkdir('app/css');
			this.dest.mkdir('app/js');
			this.dest.mkdir('app/img');

			this.src.copy('rocket.png', 'app/img/rocket.png');

			this.dest.mkdir('app/plugins');

			this.template('_package.json', 'package.json');
			this.template('_bower.json', 'bower.json');
			this.template('Gruntfile.js', 'Gruntfile.js');
			this.template('README.md', 'README.md');
		},

		html: function () {
			this.template('index.html', 'app/index.html');
			this.template('template.html', 'app/template.html');
		},

		sass: function () {

			var cb = this.async();

			this.remote('BarkleyREI', 'sass_boilerplate', 'master', function (err, remote) {
				if (err) {
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
