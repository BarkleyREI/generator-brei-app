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
			name: 'type',
			message: 'Pattern type: module, partial, or template',
			default: 'module'
		},
		{
			type: 'input',
			name: 'name',
			message: 'Pattern Name: basic-footer, breadcrumbs, etc',
			default: 'basic'
		}];

		this.prompt(prompts, function (props) {
			var name = props.name;
			var type = props.type;
			var formattedNameSASS, formattedNameHBS;

			if (!/s$/.test(type)) {
				type = type + 's';
			}

			// // Remove the first _ (or __)
			if (/^_/g.test(name)) {
				name = name.replace(/^_+/, '');
			}
			// Change all whitespace to -
			if (/\s/g.test(name)) {
				name = name.replace(/\s/g, '-');
			}
			// Change all remaining _ to -
			if (/_/g.test(name)) {
				name = name.replace(/_/g, '-');
			}
			// Remove any file extensions
			if (/\..+/g.test(name)) {
				name = name.replace(/\..+/g, '');
			}

			if (type === 'modules') {
				formattedNameHBS = '_' + name + '.hbs';
			} else {
				formattedNameHBS = name + '.hbs';
			}
			formattedNameSASS = '_' + name + '.scss';

			this.type = type;
			this.name = name;
			this.formattedNameHBS = formattedNameHBS;
			this.formattedNameSASS = formattedNameSASS;

			done();
		}.bind(this));
	},

	writing: {
		pattern: function () {
			var self = this;
			var cb = this.async();
			var fromPath = this.type + '/' + this.name + '/';

			var toPathHBS = this.type !== 'templates' ?
											'app/assemble/' + self.type + '/' + self.formattedNameHBS :
											'app/assemble/' + self.formattedNameHBS;
			var toPathSCSS = 'app/sass/' + self.type + '/' + self.formattedNameSASS;

			// Directory Structure
			this.remote('BarkleyREI', 'brei-pattern-library', 'master', function (err, remote) {
				if (err) {
					console.log('ERROR WHILE FETCHING PATTER', err);
					return cb(err);
				}

				remote.copy(fromPath + self.formattedNameHBS, toPathHBS);
				remote.copy(fromPath + self.formattedNameSASS, toPathSCSS);

				cb();
			}, true);
		}
	}
});

module.exports = BreiAppGenerator;
