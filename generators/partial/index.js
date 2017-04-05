'use strict';

var Generator = require('yeoman-generator');
var util = require('../../lib/utils.js');

module.exports = class extends Generator {

	constructor(args, opts) {

		// Calling the super constructor is important so our generator is correctly set up
	    super(args, opts);

		this.pkg = require('../../package.json');

	}

	prompting() {
		var done = this.async();

		var prompts = [{
			type: 'input',
			name: 'name',
			message: 'Partial name ("_green-button", "header-logo")',
			default: ''
		}, {
			type: 'input',
			name: 'tag',
			message: 'Parent tag (Default: div)',
			default: 'div'
		}, {
			type: 'input',
			name: 'aria',
			message: 'ARIA role? (Default: none)',
			default: ''
		}];

		return this.prompt(prompts).then(function (props) {
			var name = props.name;
			var tag = props.tag;
			var aria = props.aria;
			var pretty = name;

			name = util._format_input(name);
			pretty = util._prettify_input(name);

			this.name = name;
			this.pretty = pretty;
			this.tag = tag;
			this.aria = aria;

			done();
		}.bind(this));
	}

	writing() {
		this.fs.copyTpl(
			this.templatePath('partial.hbs'),
			this.destinationPath('app/assemble/partials/' + this.name + '.hbs'),
			{
				aria: this.aria,
				tag: this.tag,
				pretty: this.pretty,
				name: this.name
			}
		);

		this.fs.copyTpl(
			this.templatePath('partial.scss'),
			this.destinationPath('app/sass/partials/_' + this.name + '.scss'),
			{
				aria: this.aria,
				tag: this.tag,
				pretty: this.pretty,
				name: this.name
			}
		);
	}
};
