/*global describe, before, it, require, __dirname*/

const path = require('path');
const helpers = require('yeoman-test');
const os = require('os');
const util = require('../lib/utils.js');
const exec = require('child_process').exec;
const assert = require('yeoman-assert');
const fs = require('fs');

// Global vars
let build_error_code = 0;
let build_error_msg = '';
let build_error_stdout = '';
let pbuild_error_code = 0;
let pbuild_error_msg = '';
let pbuild_error_stdout = '';
let tmdir = '';
let tpdir = '';

let randoFile = Math.random().toString(36).substring(2, 15) + '.txt';
let randoDir = Math.random().toString(36).substring(2, 15);

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, brei-handlebars-helpers, brei-sass-boilerplate.
 */

describe('Generator Functionality', function () {
	'use strict';

	before(function mainGenerator(done) {
		this.timeout(300000);

		console.log('\nRunning a generator with npm install. This might take a while...\n\n');

		helpers.run(path.join(__dirname, '../generators/new'))
			.withOptions({
				'skip-install': false
			})
			.withPrompts({
				'deployDirectory': 'web'
			})
			.then(function (e) {

				console.log('\nRunning npm run build and npm run deploy');
				console.log('------------');
				console.log('Buckle up, this might take 45 - 60 seconds\n');

				tmdir = e.env.cwd;

				let writeDir = path.join(tmdir, 'app/', randoDir);

				fs.mkdir(writeDir, { recursive: true }, function (err) {
					console.log('[Modern] Random directory created: ' + writeDir + '\n');
					if (err) {
						throw err;
					}
					fs.writeFile(path.join(writeDir, randoFile), 'test random file', function (err) {
						console.log('[Modern] Random file created: ' + path.join(writeDir, randoFile) + '\n');
						if (err) {
							throw err;
						}
					});
				});

				exec('npm run build && npm run deploy', {
					cwd: e.env.cwd
				}, function (error, stdout) {
					if (error !== null) {
						if (error.code !== null) {
							if ('0' !== error.code.toString()) {
								build_error_code = error.code;
								build_error_msg = error.message;
								build_error_stdout = stdout;
							}
						}
					}

					done();
				});
			});

	});

	it('Build finished with an error code of 0', function () {
		if ('0' !== build_error_code.toString()) {
			console.log('\n\n -- ERROR --\n');
			console.error(build_error_msg);
			console.log(build_error_stdout);
			console.log('\n -- /ERROR --\n\n');
		}

		assert.textEqual('0', build_error_code.toString());
	});

	before(function patternGenerator(done) {
		this.timeout(300000);

		console.log('\nRunning a pattern generator with npm install. This might take a while...\n\n');

		helpers.run(path.join(__dirname, '../generators/pattern'))
			.withOptions({
				'skip-install': false
			})
			.withPrompts({
				'deployDirectory': 'web'
			})
			.then(function (e) {

				console.log('\nRunning npm run scaffold and npm run build');
				console.log('------------');
				console.log('Buckle up, this might take 45 - 60 seconds\n');

				tpdir = e.env.cwd;

				let writeDir = path.join(tpdir, 'public/', randoDir);

				fs.mkdir(writeDir, { recursive: true }, function (err) {
					console.log('[Pattern] Random directory created: ' + writeDir + '\n');
					if (err) {
						throw err;
					}
					fs.writeFile(path.join(writeDir, randoFile), 'test random file', function (err) {
						console.log('[Pattern] Random file created: ' + path.join(writeDir, randoFile) + '\n');
						if (err) {
							throw err;
						}
					});
				});

				exec('npm run scaffold && npm run build', {
					cwd: e.env.cwd
				}, function (error, stdout) {
					if (error !== null) {
						if (error.code !== null) {
							if ('0' !== error.code.toString()) {
								build_error_code = error.code;
								build_error_msg = error.message;
								build_error_stdout = stdout;
							}
						}
					}

					done();
				});
			});
	});

	it('Pattern build finished with an error code of 0', function () {
		if ('0' !== pbuild_error_code.toString()) {
			console.log('\n\n -- ERROR --\n');
			console.error(pbuild_error_msg);
			console.log(pbuild_error_stdout);
			console.log('\n -- /ERROR --\n\n');
		}

		assert.textEqual('0', pbuild_error_code.toString());
	});

	it('[Modern] Template Sub-Generator', function () {
		util._test_sub_generators('template', tmdir);
	});

	it('[Modern] Organism Sub-Generator', function () {
		util._test_sub_generators('organism', tmdir);
	});

	it('[Modern] Molecule Sub-Generator', function () {
		util._test_sub_generators('molecule', tmdir);
	});

	it('[Modern] Atom Sub-Generator', function () {
		util._test_sub_generators('atom', tmdir);
	});

	it('[Pattern] Template Sub-Generator', function () {
		util._test_sub_generators('template', tpdir);
	});

	it('[Pattern] Organism Sub-Generator', function () {
		util._test_sub_generators('organism', tpdir);
	});

	it('[Pattern] Molecule Sub-Generator', function () {
		util._test_sub_generators('molecule', tpdir);
	});

	it('[Pattern] Atom Sub-Generator', function () {
		util._test_sub_generators('atom', tpdir);
	});

	it('[Modern] Test updateScss.js', function (done) {
		let filePath = path.join(tmdir, 'app/assemble/no-scss.hbs');

		fs.writeFile(filePath, 'no-scss', function (err) {
			if (err) {
				throw err;
			}

			exec('npm run assemble:execute', {
				cwd: tmdir
			}, function (error) {
				if (error !== null) {
					if (error.code !== null) {
						if ('0' !== error.code.toString()) {

							assert.file([
								path.join(tmdir, 'app/assemble/no-scss.hbs'),
								path.join(tmdir, 'app/sass/templates/_no-scss.scss')
							]);

							assert.fileContent(path.join(tmdir, 'app/sass/templates/_assemble-templates.scss'), /@import\s+"home-page";\n@import\s+"test-template.scss";\n@import\s+"no-scss";/);

						}
					}
				}

				done();
			});

		});
	});

	it('[Modern] Test build capturing extraneous files', function (done) {
		assert.file([
			path.join(tmdir, 'dist/' + randoDir + '/' + randoFile)
		]);

		done();
	});

	it('[Pattern] Test build capturing extraneous files', function (done) {
		assert.file([
			path.join(tmdir, 'web/' + randoDir + '/' + randoFile)
		]);

		done();
	});

});

