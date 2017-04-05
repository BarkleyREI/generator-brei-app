'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var optional = require('optional');
var _s = require('underscore.string');
var yosay = require('yosay');
var path = require('path');

module.exports = class extends Generator {

	constructor(args, opts) {

		// Calling the super constructor is important so our generator is correctly set up
	    super(args, opts);

		this.pkg = require('../../package.json');

		this.genver = this.pkg['version'];
		this.debug = 'false';

	}

	prompting() {
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
			this.appname = answers.appname;
			this.appversion = answers.appversion;
			this.deployDirectory = answers.deployDirectory;

			done();
		}.bind(this));
	}

	writing() {

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

		// modernizrJSON() {
			this.fs.copyTpl(
				this.templatePath('_modernizr-config.json'),
				this.destinationPath('modernizr-config.json'),
				{}
			);
		// },

		// projectFiles() {
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
		// },

		// packageJSON() {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				{
					appname: _s.slugify(this.appname),
					appversion: this.appversion
				}
			);
		// },

		// breiJSON() {
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
		// },

		// git() {
			this.fs.copy(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore')
			);
		// },

		// bower() {
			this.fs.copyTpl(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json'),
				{
					appname: _s.slugify(this.appname),
					appversion: this.appversion
				}
			);
		// },

		// shell() {
			this.fs.copyTpl(
				this.templatePath('postsh'),
				this.destinationPath('post.sh'),
				{}
			);
		// }

		// Copy over the BarkleyREI stuff
		this.log('Now we copy over all the BarkleyREI sub-repos...');

		// this.sourceRoot('../../../node_modules/');

		// brei-sass-boilerplate
		var sassJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/package.json')
		);
		this.sassversion = sassJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/**/*'),
			this.destinationPath('app/sass/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-sass-mixins
		var mixinJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-sass-mixins/package.json')
		);
		this.mixinversion = mixinJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-mixins/*.scss'),
			this.destinationPath('app/sass/helpers/mixins/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-grunt-config
		var gruntJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-grunt-config/package.json')
		);
		this.gruntversion = gruntJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-grunt-config/Gruntfile.js'),
			this.destinationPath('Gruntfile.js')
		);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-grunt-config/grunt-config/*.js'),
			this.destinationPath('./grunt-config/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-assemble-structure
		var assembleJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-assemble-structure/package.json')
		);
		this.assembleversion = assembleJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-assemble-structure/**/*'),
			this.destinationPath('app/assemble/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-assemble-helpers
		var helpersJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-assemble-helpers/package.json')
		);
		this.helperversion = helpersJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-assemble-helpers/helpers.js'),
			this.destinationPath('app/assemble/helpers/helpers.js'),
			{
				globOptions: {
					'dot': true
				}
			}
		);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-assemble-helpers/updateScss.js'),
			this.destinationPath('app/lib/updateScss.js'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// Delete crap we don't need
		this.fs.delete(this.destinationPath('app/sass/README.md'));
		this.fs.delete(this.destinationPath('app/sass/package.json'));
		this.fs.delete(this.destinationPath('app/assemble/README.md'));
		this.fs.delete(this.destinationPath('app/assemble/package.json'));
		this.fs.delete(this.destinationPath('app/assemble/**/*/.gitkeep'),
		{
			globOptions: {
				'nodir': true
			}
		});

		this.fs.copyTpl(
			this.templatePath('README.md'),
			this.destinationPath('README.md'),
			{
				appname: _s.slugify(this.appname),
				sassversion: this.sassversion,
				mixinversion: this.mixinversion,
				gruntversion: this.gruntversion,
				assembleversion: this.assembleversion,
				helperversion: this.helperversion
			}
		);

	}

	install() {
		this.installDependencies({
			skipInstall: this.options['skip-install'],
			skipMessage: this.options['skip-install-message'],
			bower: false
		});
	}

	end() {

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
};
