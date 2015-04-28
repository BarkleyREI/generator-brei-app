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
		}];

		this.prompt(prompts, function (props) {
			var name = props.name;

			name = util._format_input(name);

			this.name = name;

			done();
		}.bind(this));
	},

	writing: {
		hbs: function () {
			this.template('module.hbs', 'app/assemble/modules/_' + this.name + '.hbs');
		},

		scss: function () {
			this.template('module.scss', 'app/sass/modules/_' + this.name + '.scss');
		}
	}
});

module.exports = BreiAppGenerator;
