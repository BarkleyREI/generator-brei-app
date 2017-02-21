'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var updateNotifier = require('update-notifier');
var pkg = require('../../package.json');

var BreiAppGenerator = yeoman.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
		this.answer = 'new';
	},

	prompting: function () {

		var done = this.async();

		this.log(yosay(
			'Welcome to the BarkleyREI project generator!\nv' + this.pkg.version
		));

		const notifier = updateNotifier({
			pkg,
			updateCheckInterval: 1
		});

		if (notifier.update) {

			this.log(yosay(
				'I say, there seems to be an update to the generator! Go and fetch it!'
			));

			notifier.notify();

			return true;

		} else {

			return this.prompt({
				type: 'list',
				name: 'command',
				message: 'What would you like to do?',
				default: 'Create a New Project',
				choices: [
					'Create a New Project',
					'Create a Partial',
					'Create a Module',
					'Create a Template',
					'Import a Pattern',
					'Update Your Project']
			}).then(function(answer) {

				switch (answer.command) {
					case 'Create a Partial':
						this.answer = 'partial';
						// this.composeWith('brei-app:partial', {});
						break;
					case 'Create a Module':
						this.answer = 'module';
						// this.composeWith('brei-app:module', {});
						break;
					case 'Create a Template':
						this.answer = 'template';
						// this.composeWith('brei-app:template', {});
						break;
					case 'Import a Pattern':
						this.answer = 'pattern';
						// this.composeWith('brei-app:pattern', {});
						break;
					case 'Update Your Project':
						this.answer = 'update';
						// this.composeWith('brei-app:update', {});
						break;
					default: //'Create a New Project'
						// this.composeWith('brei-app:new');
						break;
				}

				done();

			}.bind(this));

		}
	},

	install: function () {
		this.composeWith('brei-app:' + this.answer);
	}
});

module.exports = BreiAppGenerator;
