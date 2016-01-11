'use strict';

var yeoman = require('yeoman-generator');
var util = require('../../lib/utils.js');

var BreiAppGenerator = yeoman.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
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

		this.prompt(prompts, function (props) {
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
	},

	writing: {
		hbs: function () {
			this.template('partial.hbs', 'app/assemble/partials/' + this.name + '.hbs');
		},

		scss: function () {
			this.template('partial.scss', 'app/sass/partials/_' + this.name + '.scss');
		}
	}
});

module.exports = BreiAppGenerator;
