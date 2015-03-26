'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var brei = require('brei-junk');

var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
		var done = this.async();

		var prompts = [{
			type: 'input',
			name: 'templateName',
			message: 'Template name ("level-page", "column_content-one")',
			default: ''
		}];

		this.prompt(prompts, function (props) {
			this.someOption = props.someOption;

			var templateName = props.templateName;

			// Remove the first _ (or __)
			if (/^_/g.test(templateName)) {
				templateName = templateName.replace(/^_+/, '');
			}
			// Change all whitespace to -
			if (/\s/g.test(templateName)) {
				templateName = templateName.replace(/\s/g, '-');
			}
			// Change all remaining _ to -
			if (/_/g.test(templateName)) {
				templateName = templateName.replace(/_/g, '-');
			}
			// Remove any file extensions
			if (/\..+/g.test(templateName)) {
				templateName = templateName.replace(/\..+/g, '');
			}

			this.templateName = templateName;

			done();
		}.bind(this));
	},

	writing: {
		hbs: function () {
			this.template('template.hbs', 'app/assemble/' + this.templateName + '.hbs');
		},

		scss: function () {
			this.template('template.scss', 'app/sass/templates/' + this.templateName + '.scss');
		},

		// mainScss: function () {
		//	??
		// }
	}
});

module.exports = BreiAppGenerator;
