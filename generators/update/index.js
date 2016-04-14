'use strict';

var optional = require('optional');
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');
var _brei = require('../../config/brei-config.json');
var yosay = require('yosay');

var BreiAppGenerator = yeoman.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
		this.brei = optional( this.destinationRoot() + '/brei-config.json' );

		this.github = "BarkleyREI";
		if (typeof _brei.github != 'undefined') {
			this.github = _brei.github;
		}

		this.deployDirectory = "../../web";
		this.appversion = "0.0.1";
		this.appname = "static";

		if (this.brei != null) {
			this.deployDirectory = this.brei.deploy;
			this.appversion = this.brei.version;
			this.appname = this.brei.name;
		}

	},

	prompting: function () {

		var done = this.async();

		this.log(yosay(
			'The update generator does not overwrite your files. It checks out a fresh project ' +
			'into a folder called _update in the static directory. It is up to you to do the file ' +
			'comparison and copy over changes. Proceed at your own risk.\n\n' +
			'Type `y` to continue.'
		));

		var prompts = [{
			type: 'confirm',
			name: 'understand',
			message: 'Do you wish to continue?',
			default: false,
		}];

		this.prompt(prompts, function (answers) {

			this.understand = answers.understand;

			if (!this.understand) {
				this.log('\nOh...okay =(');
				return;
			}

			this.destinationRoot('../_update/');

			done();

		}.bind(this));

	},

	writing: {

		staging: function () {

			mkdirp('../_update');

			mkdirp('../_update/app');
			// All the grunt configuration files
			mkdirp('../_update/grunt-config');
			// Assembled HTML
			mkdirp('../_update/app/modules');
			// Compiled CSS
			mkdirp('../_update/app/css');
			// Your scripts
			mkdirp('../_update/app/js');
			mkdirp('../_update/app/js/plugins');
			mkdirp('../_update/app/js/modules');
			mkdirp('../_update/app/js/lib');
			// Images
			mkdirp('../_update/app/img');

			// this.fs.copy(this.destinationPath('app/lib/*'), this.destinationPath('../_update/lib'));

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

		projectFiles: function () {
		  this.fs.copyTpl(
			this.templatePath('../../new/templates/jshintrc'),
			this.destinationPath('.jshintrc'),
			{}
		  );

		  this.fs.copyTpl(
			this.templatePath('../../new/templates/bowerrc'),
			this.destinationPath('.bowerrc'),
			{}
		  );

		  this.fs.copyTpl(
			this.templatePath('../../new/templates/scss-lint.yml'),
			this.destinationPath('.scss-lint.yml'),
			{}
		  );
		},

		readme: function () {

		  this.fs.copyTpl(
			this.templatePath('../../new/templates/README.md'),
			this.destinationPath('README.md'),
			{
			  appname: _s.slugify(this.appname)
			}
		  );

		},

		packageJSON: function () {
		  this.fs.copyTpl(
			this.templatePath('../../new/templates/_package.json'),
			this.destinationPath('package.json'),
			{
			  appname: _s.slugify(this.appname),
			  appversion: this.appversion
			}
		  );
		},

		breiJSON: function () {
		  this.fs.copyTpl(
			this.templatePath('../../new/templates/_brei-config.json'),
			this.destinationPath('brei-config.json'),
			{
			  appname: _s.slugify(this.appname),
			  appversion: this.appversion,
			  deployDirectory: this.deployDirectory
			}
		  );
		},

		git: function () {
		  this.fs.copy(
			this.templatePath('../../new/templates/gitignore'),
			this.destinationPath('.gitignore')
		  );
		},

		bower: function () {
		  this.fs.copy(
			this.templatePath('../../new/templates/_bower.json'),
			this.destinationPath('bower.json'),
			{
			  appname: _s.slugify(this.appname),
			  appversion: this.appversion
			}
		  );
		}

	}
});

module.exports = BreiAppGenerator;
