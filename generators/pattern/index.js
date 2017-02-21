'use strict';

var yeoman = require('yeoman-generator');
var remote = require('yeoman-remote');
var path = require('path');

var BreiAppGenerator = yeoman.Base.extend({
	initializing: function () {
		var cb = this.async();
		var self = this;
		self.pkg = require('../../package.json');

		// Get available templates
		remote('BarkleyREI', 'brei-pattern-library', 'master', function (err, cachePath) {
			if (err) {
				console.log('ERROR WHILE FETCHING PATTER', err);
				return cb(err);
			}

			this.copy(
				path.join(cachePath, 'patterns.json'),
				this.destinationPath('patterns.json'),
				{}
			);

			self.patterns = JSON.parse(self.fs.read('patterns.json'));

			cb();
		}.bind(this));
	},

	prompting: function () {
		var done = this.async();

		return this.prompt({
			type: 'list',
			name: 'type',
			message: 'Pattern type:',
			default: 'Module',
			choices: ['Module', 'Partial', 'Template'],
			filter: function (val) { return val.toLowerCase() + 's'; }
		}).then(function (typeAnswer) {

			var type = typeAnswer.type;

			// console.log(this.patterns);

			return this.prompt({
				type: 'list',
				name: 'name',
				message: 'Pattern Name: basic-footer, breadcrumbs, etc',
				default: 'basic-footer',
				choices: this.patterns[type]
			}).then(function (nameAnswer) {

				var name = nameAnswer.name;
				var type = typeAnswer.type;
				var formattedNameSASS, formattedNameHBS;

				// Really only to help with tests
				if (!/s$/.test(type)) {
					type = type + 's';
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
			remote('BarkleyREI', 'brei-pattern-library', 'master', function (err, cachePath) {
				if (err) {
					console.log('ERROR WHILE FETCHING PATTERN', err);
					return cb(err);
				}

				this.copy(path.join(cachePath, fromPath + self.formattedNameHBS), toPathHBS, {});
				this.copy(path.join(cachePath, fromPath + self.formattedNameSASS), toPathSCSS, {});

				cb();
			}.bind(this));
		}
	}
});

module.exports = BreiAppGenerator;
