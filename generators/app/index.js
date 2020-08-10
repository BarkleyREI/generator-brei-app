'use strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const fs = require('fs');

const theCwd = process.cwd();

module.exports = class extends Generator {

	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);

		this.argument('name', {type: String, required: false});
		this.argument('type', {type: String, default: 'new'});
		this.argument('deployDir', {type: String, default: '../../web'});
	}

	initializing() {
		this.pkg = require('../../package.json');
		this.answer = 'new';

		this.selfName = this.pkg['name'];

		let notifier = updateNotifier({
			pkg,
			updateCheckInterval: 1
		});

		if (notifier.update) {
			this.log(yosay(
				'I say, there seems to be an update to the generator! Go and fetch it!'
			));

			notifier.notify();

			notifier = null;

			return true;
		}
	}

	async prompting() {

		this.composeOptions = {};

		if (typeof this.options.name === 'undefined' || this.options.name === '') {

			this.mode = 'new';

			if (fs.existsSync(theCwd + '/_config/_brei.json')) {
				this.mode = 'modern';
				this.testCfg = require(theCwd + '/_config/_brei.json');
				if (typeof this.testCfg.type !== 'undefined') {
					this.mode = this.testCfg.type;
				}
			} else if (fs.existsSync(theCwd + '/brei-config.json')) {
				this.mode = 'legacy';
			}

			let theChoices = [];
			let theDefault = '';
			let theType = '';
			switch (this.mode) {
				case 'modern':
					theType = 'This is a modern project.';
					theDefault = 'Create an Atom';
					theChoices = [
						'Create a Template',
						'Create an Organism',
						'Create a Molecule',
						'Create an Atom'
					];
					break;
				case 'pattern':
					theType = 'This is a pattern library.';
					break;
				case 'legacy':
					theType = 'This is a legacy project.';
					theDefault = 'Create a Partial';
					theChoices = [
						'Create a Partial',
						'Create a Module'
					];
					break;
				default:
				case 'new':
					theType = 'Looks like you need a project!';
					theDefault = 'Create a New Modern Project';
					theChoices = [
						'Create a New Modern Project',
						'Create a New Pattern Library (Alpha)'
					];
					break;
			}

			if (theChoices.length > 0) {

				this.log(yosay(
					'Welcome to the BarkleyREI project generator!\nv' + this.pkg.version + '\n\n' + theType
				));

				this.answers = await this.prompt({
					type: 'list',
					name: 'command',
					message: 'What would you like to do?',
					default: theDefault,
					choices: theChoices
				});

				switch (this.answers.command) {
					case 'Create a Partial':
						this.answer = 'partial';
						break;
					case 'Create a Module':
						this.answer = 'module';
						break;
					case 'Create a Template':
						this.answer = 'template';
						break;
					case 'Create an Organism':
						this.answer = 'organism';
						break;
					case 'Create a Molecule':
						this.answer = 'molecule';
						break;
					case 'Create an Atom':
						this.answer = 'atom';
						break;
					case 'Create a New Pattern Library':
						this.answer = 'pattern';
						break;
					default:
						break;
				}

			} else {

				this.log(yosay(
					'There is already a project here and I cannot do anything with it!\n\nI either do not recognize it or have no options yet.\nv' + this.pkg.version
				));

			}

		} else {
			let theType = 'new';

			if (typeof this.options.type !== 'undefined' && this.options.type !== '') {
				let _theType = this.options.type;
				let theType = _theType;

				switch (_theType) {
					case 'pattern':
						theType = 'pattern';
						break;
					case 'new':
					case 'modern':
					default:
						theType = 'new';
						break;
				}

				this.answer = theType;
				this.composeOptions = {
					name: this.options.name,
					type: this.options.type,
					deployDir: this.options.deployDir
				};
			} else {
				this.answer = theType;
				this.composeOptions = {
					name: this.options.name,
					type: this.options.type,
					deployDir: this.options.deployDir
				};
			}

		}
	}

	install() {
		this.composeWith(require.resolve(this.selfName + '/generators/' + this.answer), this.composeOptions);
	}
};
