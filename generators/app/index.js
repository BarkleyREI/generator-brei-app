'use strict';

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const fs = require('fs');

const theCwd = process.cwd();

let choiceAnswers = {
	'partial': 'Create a Partial',
	'module': 'Create a Module',
	'template': 'Create a Template',
	'atom': 'Create an Atom',
	'molecule': 'Create a Molecule',
	'organism': 'Create an Organism',
	'pattern': 'Create a New Pattern Library (Alpha)',
	'new': 'Create a New Modern Project'
};

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
	}

	async prompting() {

		this.composeOptions = {};
		this.buildable = true;

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
					theDefault = choiceAnswers.atom;
					theChoices = [
						choiceAnswers.template,
						choiceAnswers.organism,
						choiceAnswers.molecule,
						choiceAnswers.atom
					];
					break;
				case 'pattern':
					theType = 'This is a pattern library.';
					break;
				case 'legacy':
					theType = 'This is a legacy project.';
					theDefault = choiceAnswers.partial;
					theChoices = [
						choiceAnswers.template,
						choiceAnswers.module,
						choiceAnswers.partial
					];
					break;
				default:
				case 'new':
					theType = 'Looks like you need a project!';
					theDefault = choiceAnswers.new;
					theChoices = [
						choiceAnswers.new,
						choiceAnswers.pattern
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
					case choiceAnswers.partial:
						this.answer = 'partial';
						break;
					case choiceAnswers.module:
						this.answer = 'module';
						break;
					case choiceAnswers.template:
						this.answer = 'template';
						break;
					case choiceAnswers.organism:
						this.answer = 'organism';
						break;
					case choiceAnswers.molecule:
						this.answer = 'molecule';
						break;
					case choiceAnswers.atom:
						this.answer = 'atom';
						break;
					case choiceAnswers.pattern:
						this.answer = 'pattern';
						break;
					default:
						break;
				}

			} else {

				if (this.mode === 'pattern') {

					this.log(yosay(
						'No generation options exist for pattern libraries yet, so I cannot help you. Sorry!\nv' + this.pkg.version
					));

				} else {

					this.log(yosay(
						'There is already a project here and I cannot do anything with it!\n\nI either do not recognize it or have no options yet.\nv' + this.pkg.version
					));

				}

				this.buildable = false;

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
		if (this.buildable) {
			this.composeWith(require.resolve(this.selfName + '/generators/' + this.answer), this.composeOptions);
		}
	}
};
