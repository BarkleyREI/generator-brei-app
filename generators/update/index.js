'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

var BreiAppGenerator = yeoman.Base.extend({
	initializing: function () {
		this.pkg = require('../../package.json');
	},

	prompting: function () {

	},

	writing: {

		staging: function () {

			mkdirp('_update');

			mkdirp('_update/app');
			// All the grunt configuration files
			mkdirp('_update/grunt-config');
			// Assembled HTML
			mkdirp('_update/app/modules');
			// Compiled CSS
			mkdirp('_update/app/css');
			// Your scripts
			mkdirp('_update/app/js');
			mkdirp('_update/app/js/plugins');
			mkdirp('_update/app/js/modules');
			mkdirp('_update/app/js/lib');
			// Images
			mkdirp('_update/app/img');

			// this.fs.copy(this.destinationPath('app/lib/*'), this.destinationPath('_update/lib'));

		},

		update: function () {



		}
	}
});

module.exports = BreiAppGenerator;
