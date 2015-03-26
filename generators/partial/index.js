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
			name: 'partialName',
			message: 'Partial name ("_green-button", "header-logo")',
			default: ''
		}];

		this.prompt(prompts, function (props) {
			this.someOption = props.someOption;

			var partialName = props.partialName;

			// Remove the first _ (or __)
			if (/^_/g.test(partialName)) {
				partialName = partialName.replace(/^_+/g, '');
			}
			// Change all whitespace to -
			if (/\s/g.test(partialName)) {
				partialName = partialName.replace(/\s/g, '-');
			}
			// Change all remaining _ to -
			if (/_/g.test(partialName)) {
				partialName = partialName.replace(/_/g, '-');
			}
			// Remove any file extensions
			if (/\..+/g.test(partialName)) {
				partialName = partialName.replace(/\..+/g, '');
			}

			this.partialName = partialName;

			done();
		}.bind(this));
	},

	writing: {
		hbs: function () {
			this.template('partial.hbs', 'app/assemble/partials/' + this.partialName + '.hbs');
		},

		scss: function () {
			this.template('partial.scss', 'app/sass/partials/_' + this.partialName + '.scss');
		},

		// mainScss: function () {
		//	??
		// }
	}
});

module.exports = BreiAppGenerator;
