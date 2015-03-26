'use strict';

var yeoman = require('yeoman-generator');

var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
		var done = this.async();

		var prompts = [{
			type: 'input',
			name: 'moduleName',
			message: 'Module name ("_global-slider", "news-feed")',
			default: ''
		}];

		this.prompt(prompts, function (props) {
			this.someOption = props.someOption;

			var moduleName = props.moduleName;

			// Remove the first _ (or __)
			if (/^_/g.test(moduleName)) {
				moduleName = moduleName.replace(/^_+/g, '');
			}
			// Change all whitespace to -
			if (/\s/g.test(moduleName)) {
				moduleName = moduleName.replace(/\s/g, '-');
			}
			// Change all remaining _ to -
			if (/_/g.test(moduleName)) {
				moduleName = moduleName.replace(/_/g, '-');
			}
			// Remove any file extensions
			if (/\..+/.test(moduleName)) {
				moduleName = moduleName.replace(/\..+/g, '');
			}

			this.moduleName = moduleName;

			done();
		}.bind(this));
	},

	writing: {
		hbs: function () {
			this.template('module.hbs', 'app/assemble/modules/_' + this.moduleName + '.hbs');
		},

		scss: function () {
			this.template('module.scss', 'app/sass/modules/_' + this.moduleName + '.scss');
		}

		// mainScss: function () {
		// ??
		// }
	}
});

module.exports = BreiAppGenerator;
