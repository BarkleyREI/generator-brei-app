'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var BreiAppGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {
		this.log(yosay(
			'Welcome to the BarkleyREI project generator!'
		));

		this.prompt({
			type: 'list',
			name: 'update',
			message: 'What would you like to Update?',
			default: 'Grunt Configuration Files',
			choices: [
				'Assemble Project Structure',
				'Assemble Helper Files',
				'Sass Boilerplate',
				'Grunt Configuration Files'
				]
		}, function(answer) {
			var cb = this.async();

			switch (answer.update) {
				case 'Assemble Project Structure':
					this.remote('BarkleyREI', 'brei-assemble-structure', 'master', function (err, remote) {
						if (err) {
							console.log('--ERROR WHILE GETTING ASSEMBLE STRUCTURE!!', err);
							return cb(err);
						}

						remote.directory('.', 'app/assemble');

						cb();
					}, true);
					break;
				case 'Assemble Helper Files':
					this.remote('BarkleyREI', 'brei-assemble-helpers', 'master', function (err, remote) {
						if (err) {
							console.log('--ERROR WHILE GETTING HELPERS!!', err);
							return cb(err);
						}

						remote.directory('.', 'app/assemble/helpers');

						cb();
					}, true);
					break;
				case 'Sass Boilerplate':
					this.remote('BarkleyREI', 'sass_boilerplate', 'master', function (err, remote) {
						if (err) {
							console.log('--ERROR WHILE GETTING SASS!!', err);
							return cb(err);
						}

						remote.directory('.', 'app/sass');

						cb();
					}, true);
					break;
				default: // 'Grunt Configuration Files':
					this.remote('BarkleyREI', 'brei-grunt-config', 'master', function (err, remote) {
						if (err) {
							console.log('--ERROR WHILE GETTING GRUNT CONFIGS!!', err);
							return cb(err);
						}

						remote.directory('grunt-config', 'grunt-config');
						remote.src.copy('Gruntfile.js', 'Gruntfile.js');

						cb();
					}, true);
					break;
			}

		}.bind(this));
	},
});

module.exports = BreiAppGenerator;
