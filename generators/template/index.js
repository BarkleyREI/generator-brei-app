'use strict';

var yeoman = require('yeoman-generator');
var util = require('../../lib/utils.js');

var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
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

		this.prompt(prompts, function (props) {
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
	},

	writing: {
		hbs: function () {
			this.template('template.hbs', 'app/assemble/' + this.name + '.hbs');
		},

		scss: function () {
			this.template('template.scss', 'app/sass/templates/_' + this.name + '.scss');
		}
	}
});

module.exports = BreiAppGenerator;
