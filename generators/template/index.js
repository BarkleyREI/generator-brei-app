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
			message: 'Template name ("level-page", "column_content-one")',
			default: ''
		}, {
			type: 'input',
			name: 'tag',
			message: 'Parent tag (Default: div)',
			default: 'div'
		}];

		return this.prompt(prompts).then(function (props) {
			var name = props.name;
			var tag = props.tag;
			var pretty = name;

			name = util._format_input(name);
			pretty = util._prettify_input(name);

			this.name = name;
			this.pretty = pretty;
			this.tag = tag;

			done();
		}.bind(this));
	}

	writing() {
		this.fs.copyTpl(
			this.templatePath('template.hbs'),
			this.destinationPath('app/assemble/' + this.name + '.hbs'),
			{
				tag: this.tag,
				pretty: this.pretty,
				name: this.name
			}
		);

		this.fs.copyTpl(
			this.templatePath('template.scss'),
			this.destinationPath('app/sass/templates/_' + this.name + '.scss'),
			{
				tag: this.tag,
				pretty: this.pretty,
				name: this.name
			}
		);

		this.fs.copyTpl(
			this.templatePath('template.json'),
			this.destinationPath('app/assemble/fixtures/' + this.name + '.json'),
			{
				tag: this.tag,
				pretty: this.pretty,
				name: this.name
			}
		);
	}
};
