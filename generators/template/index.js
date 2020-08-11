'use strict';

const Generator = require('yeoman-generator');
const util = require('../../lib/utils.js');
const _ = require('lodash');
const fs = require('fs');

const theCwd = process.cwd();

module.exports = class extends Generator {

	constructor(args, opts) {

		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);

		this.pkg = require('../../package.json');

	}

	initializing() {
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

		this.sassDir = 'scss';

		if (this.mode === 'legacy') {
			this.sassDir = 'sass';
		}
	}

	async prompting() {

		this.answers = await this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Template name ("standard-level", "program-finder")',
				default: ''
			}
		]);

		let name = this.answers.name;

		this.safename = util._format_input(name);
		this.prettyname = _.startCase(name);

	}

	writing() {
		this.fs.copyTpl(
			this.templatePath('template.hbs'),
			this.destinationPath('app/assemble/' + this.safename + '.hbs'),
			{
				pretty: this.prettyname,
				name: this.safename
			}
		);

		this.fs.copyTpl(
			this.templatePath('template.scss'),
			this.destinationPath('app/' + this.sassDir + '/templates/_' + this.safename + '.scss'),
			{
				name: this.safename
			}
		);

		this.fs.copyTpl(
			this.templatePath('template.json'),
			this.destinationPath('app/assemble/fixtures/' + this.safename + '.json'),
			{
				pretty: this.prettyname
			}
		);
	}
};
