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
			message: 'Module name ("_global-slider", "news-feed")',
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
			this.template('module.hbs', 'app/assemble/modules/_' + this.name + '.hbs');
		},

		scss: function () {
			this.template('module.scss', 'app/sass/modules/_' + this.name + '.scss');
		},

		fixture: function () {
			this.template('module.json', 'app/assemble/fixtures/' + this.name + '.json');
		}
	}
});

module.exports = BreiAppGenerator;
