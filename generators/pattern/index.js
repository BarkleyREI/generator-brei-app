'use strict';

const Generator = require('yeoman-generator');
const _s = require('underscore.string');
const yosay = require('yosay');

module.exports = class extends Generator {

	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);

		this.pkg = require('../../package.json');

		this.genver = this.pkg['version'];

		this.argument('name', {type: String, required: false});
		this.argument('deployDir', {type: String, default: '../../web'});
	}

	initializing() {

		// If we need to do anything before prompting.
		// Checking project state, getting configs, etc.

	}

	async prompting() {

		if (typeof this.options.name === 'undefined' || this.options.name === '') {

			// Ask the people what they want.
			this.answers = await this.prompt([
				{
					type: 'input',
					name: 'appname',
					message: 'Name of Client (e.g. NOVA, Corpus, Times Square NYC)',
					default: 'static'
				}, {
					type: 'input',
					name: 'stash',
					message: 'Stash Repository Clone URL (ssh:// .git) (Optional)',
					default: ''
				}, {
					type: 'input',
					name: 'deployDirectory',
					message: 'Deploy directory (relative to current path)',
					default: '../../web'
				}
			]);

			this.appname = this.answers.appname;
			this.appslug = _s.slugify(this.answers.appname);
			this.stash = this.answers.stash;
			this.deployDirectory = this.answers.deployDirectory;

		} else {

			this.appname = this.options.name;
			this.appslug = _s.slugify(this.options.name);
			this.stash = '';
			this.deployDirectory = this.options.deployDir;

		}

	}

	configuring() {

		//
		// Save configurations and configure the actual project
		//

		// Grab reference to the pattern scaffold package.json
		this.scaffoldPJ = require(this.templatePath('../../../node_modules/brei-pattern-scaffold/package.json'));

		// Build out new package.json using scaffold values, plus new stuff if we need any.
		this.newPJ = {
			'name': this.appslug,
			'version': '1.0.0',
			'description': this.scaffoldPJ.description,
			'author': this.scaffoldPJ.author,
			'license': this.scaffoldPJ.license,
			'browserslist': this.scaffoldPJ.browserslist,
			'eslintConfig': this.scaffoldPJ.eslintConfig,
			'dependencies': this.scaffoldPJ.dependencies,
			'devDependencies': this.scaffoldPJ.devDependencies,
			'scripts': this.scaffoldPJ.scripts
		};

		this.newPJ.scripts.postinstall = 'npm run init';

		if (this.stash !== '') {
			this.newPJ.repository = {
				'type': 'git',
				'url': this.stash
			};
		}

		// Basic brei config with values we need for various things.
		// I use this for a command line thing and like keeping custom stuff out of the package.json. - Ian
		// This also identifies the type of project to the generator.
		this.breiJ = {
			'title': this.appname,
			'generatorVersion': this.genver,
			'type': 'pattern',
			'app': 'app',
			'dist': 'dist',
			'deploy': this.deployDirectory
		};

	}

	writing() {

		// Write generator specific files

		this.fs.copy(
			this.templatePath('gitignore'),
			this.destinationPath('.gitignore')
		);

		// brei-pattern-scaffold
		let scaffoldJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-pattern-scaffold/package.json')
		);
		this.breiJ['brei-pattern-scaffold'] = scaffoldJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-pattern-scaffold/**/*'),
			this.destinationPath('.'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// Cleanup
		this.fs.delete(this.destinationPath('package.json'));

		// brei-sass-boilerplate
		let sassJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/package.json')
		);
		this.breiJ['brei-sass-boilerplate'] = sassJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/**/*'),
			this.destinationPath('assets/scss/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-boilerplate/.stylelintrc.json'),
			this.destinationPath('_config/.stylelintrc.json'),
			{
				globOptions: {
					'dot': true
				}
			}
		);
		this.fs.copy(
			this.templatePath('../../../node_modules/foundation-sites/scss/settings/_settings.scss'),
			this.destinationPath('assets/scss/_settings.scss'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-sass-mixins
		let mixinJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-sass-mixins/package.json')
		);
		this.breiJ['brei-sass-mixins'] = mixinJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-sass-mixins/*.scss'),
			this.destinationPath('assets/scss/helpers/mixins/'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// brei-handlebars-helpers
		let helpersJson = this.fs.readJSON(
			this.templatePath('../../../node_modules/brei-handlebars-helpers/package.json')
		);
		this.breiJ['brei-handlebars-helpers'] = helpersJson.version;
		this.fs.copy(
			this.templatePath('../../../node_modules/brei-handlebars-helpers/helpers.js'),
			this.destinationPath('lib/helpers/helpers.js'),
			{
				globOptions: {
					'dot': true
				}
			}
		);

		// README
		this.fs.delete(this.destinationPath('README.md'));
		this.fs.copyTpl(
			this.templatePath('../../../node_modules/brei-pattern-scaffold/README.md'),
			this.destinationPath('README.md'),
			{
				'appname': this.appname,
				'stashrepo': this.stash,
				'scaffoldversion': scaffoldJson.version,
				'sassversion': sassJson.version,
				'mixinversion': mixinJson.version,
				'helperversion': helpersJson.version,
			}
		);

		// Delete crap we don't need
		this.fs.delete(this.destinationPath('.github/'));
		this.fs.delete(this.destinationPath('.travis.yml'));
		this.fs.delete(this.destinationPath('assets/scss/.github/'));
		this.fs.delete(this.destinationPath('assets/scss/.gitkeep'));
		this.fs.delete(this.destinationPath('assets/scss/.snyk/'));
		this.fs.delete(this.destinationPath('assets/scss/.stylelintignore'));
		this.fs.delete(this.destinationPath('assets/scss/.stylelintrc.json'));
		this.fs.delete(this.destinationPath('assets/scss/.travis.yml'));
		this.fs.delete(this.destinationPath('assets/scss/icons/.gitkeep'));
		this.fs.delete(this.destinationPath('assets/scss/node_modules'));
		this.fs.delete(this.destinationPath('assets/scss/package.json'));
		this.fs.delete(this.destinationPath('assets/scss/README.md'));
		this.fs.delete(this.destinationPath('assets/scss/test/'));
		this.fs.delete(this.destinationPath('public/.gitkeep'));
		this.fs.delete(this.destinationPath('test/'));

		// console.log(this.destinationPath('.'));

		this.fs.writeJSON(this.destinationPath('_config/_brei.json'), this.breiJ);
		this.fs.writeJSON(this.destinationPath('package.json'), this.newPJ);

	}

	end() {

		// Cleanup, say goodbye

		if (this.options['skip-install']) {
			this.log(yosay(
				'Make sure to run `npm install` to install all your dependencies! Happy coding!\n\n' +
				'Generated with v' + this.pkg.version
			));
		} else {
			this.log(yosay(
				'Happy coding!\n\n' +
				'Generated with v' + this.pkg.version
			));
		}

	}
};
