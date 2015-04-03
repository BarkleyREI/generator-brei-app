'use strict';

var yeoman = require('yeoman-generator');


var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		var cb = this.async();
		var self = this;
		self.pkg = require('../../package.json');

		// Get available templates
		self.remote('BarkleyREI', 'brei-pattern-library', 'master', function (err, remote) {
			if (err) {
				console.log('ERROR WHILE FETCHING PATTER', err);
				return cb(err);
			}

			self.patterns = remote.src.readJSON('patterns.json');

			cb();
		}, true);
	},

	prompting: function () {
		var done = this.async();

		this.prompt({
			type: 'list',
			name: 'type',
			message: 'Pattern type:',
			default: 'Module',
			choices: ['Module', 'Partial', 'Template'],
			filter: function(val) { return val.toLowerCase() + 's'; }
		}, function(typeAnswer) {

			var type = typeAnswer.type;

			this.prompt({
				type: 'list',
				name: 'name',
				message: 'Pattern Name: basic-footer, breadcrumbs, etc',
				default: 'basic-footer',
				choices: this.patterns[type]
			} ,function (nameAnswer) {

				var name = nameAnswer.name;
				var type = typeAnswer.type;
				var formattedNameSASS, formattedNameHBS;

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
