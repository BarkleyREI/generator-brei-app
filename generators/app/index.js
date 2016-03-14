'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var BreiAppGenerator = yeoman.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
		this.log(yosay(
			'Welcome to the BarkleyREI project generator!\nv' + this.pkg.version
		));

		this.prompt({
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
		}, function(answer) {

			switch (answer.command) {
				case 'Create a Partial':
					this.composeWith('brei-app:partial', {});
					break;
				case 'Create a Module':
					this.composeWith('brei-app:module', {});
					break;
				case 'Create a Template':
					this.composeWith('brei-app:template', {});
					break;
				case 'Import a Pattern':
					this.composeWith('brei-app:pattern', {});
					break;
				case 'Update Your Project':
					this.composeWith('brei-app:update', {});
					break;
				default: //'Create a New Project'
					this.composeWith('brei-app:new', {});
					break;
			}

		}.bind(this));
	},
});

module.exports = BreiAppGenerator;
