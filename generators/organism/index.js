'use strict';

const Generator = require('yeoman-generator');
const util = require('../../lib/utils.js');
const _ = require('lodash');

module.exports = class extends Generator {

	constructor(args, opts) {

		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);

		this.pkg = require('../../package.json');

	}

	async prompting() {

		this.answers = await this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Organism name ("global-slider", "news-feed")',
				default: ''
			}, {
				type: 'input',
				name: 'tag',
				message: 'Parent tag (Default: div)',
				default: 'div'
			}, {
				type: 'input',
				name: 'script',
				message: 'ES6 module name? E.g. accordion (Default: No ES6 module generated)',
				default: ''
			}
		]);

		let name = this.answers.name;
		let tag = this.answers.tag;
		let script = this.answers.script;

		if (tag === '' || typeof tag === 'undefined') {
			tag = 'div';
		}

		this.safename = util._format_input(name);
		this.prettyname = _.startCase(name);
		this.tag = _.lowerCase(tag);
		this.scriptName = '';

		if (script !== '') {
			this.script = script;
			this.scriptName = _.camelCase(script);
		}

	}

	writing() {

		this.fs.copyTpl(
			this.templatePath('organism.hbs'),
			this.destinationPath('app/assemble/organisms/_' + this.safename + '.hbs'),
			{
				tag: this.tag,
				pretty: this.prettyname,
				name: this.safename
			}
		);

		this.fs.copyTpl(
			this.templatePath('organism.scss'),
			this.destinationPath('app/scss/organisms/_' + this.safename + '.scss'),
			{
				name: this.safename
			}
		);

		this.fs.copyTpl(
			this.templatePath('molecule.hbs'),
			this.destinationPath('app/assemble/molecules/' + this.safename + '.hbs'),
			{
				tag: this.tag,
				pretty: this.prettyname,
				name: this.safename
			}
		);

		this.fs.copyTpl(
			this.templatePath('molecule.scss'),
			this.destinationPath('app/scss/molecules/_' + this.safename + '.scss'),
			{
				name: this.safename
			}
		);

		this.fs.copyTpl(
			this.templatePath('organism.json'),
			this.destinationPath('app/assemble/fixtures/' + this.safename + '.json'),
			{
				pretty: this.prettyname
			}
		);

		if (this.scriptName !== '' && typeof this.scriptName !== 'undefined') {

			this.fs.copyTpl(
				this.templatePath('organism.js'),
				this.destinationPath('app/ejs/modules/' + this.scriptName + '.js'),
				{
					pretty: this.prettyname,
					name: this.scriptName
				}
			);

		}

	}

};
