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

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, brei-handlebars-helpers, brei-sass-boilerplate.
 */

describe('Generator Functionality', function () {
	'use strict';

	let tdir = path.join(os.tmpdir(), './temp');

	before(function mainGenerator(done) {
		this.timeout(150000);

		console.log('\nRunning a generator with npm install. This might take a while...\n\n');

		helpers.run(path.join(__dirname, '../generators/new'))
			.inDir(tdir)
			.withOptions({
				'skip-install': false
			})
			.withPrompts({
				'deployDirectory': 'web'
			})
			.on('end', function () {
				console.log('\nRunning npm run build and npm run deploy');
				console.log('------------');
				console.log('Buckle up, this might take 45 - 60 seconds\n');

				exec('npm run build && npm run deploy', {
					cwd: tdir
				}, function (error, stdout, stderr) {
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

	it('Template Sub-Generator', function () {
		util._test_sub_generators('template', tdir);
	});

	it('Organism Sub-Generator', function () {
		util._test_sub_generators('organism', tdir);
	});

	it('Molecule Sub-Generator', function () {
		util._test_sub_generators('molecule', tdir);
	});

	it('Atom Sub-Generator', function () {
		util._test_sub_generators('atom', tdir);
	});

	// We can't run these tests since everything is geared around the modern generator, not legacy.
	//
	// it('Partial (Legacy) Sub-Generator', function () {
	// 	util._test_sub_generators('partial', tdir);
	// });
	//
	// it('Module (Legacy) Sub-Generator', function () {
	// 	util._test_sub_generators('module', tdir);
	// });

	it('Test updateScss.js', function (done) {
		let filePath = path.join(tdir, 'app/assemble/no-scss.hbs');

		fs.writeFile(filePath, 'no-scss', function (err) {
			if (err) {
				throw err;
			}

			exec('npm run assemble:execute', {
				cwd: tdir
			}, function (error, stdout, stderr) {
				if (error !== null) {
					if (error.code !== null) {
						if ('0' !== error.code.toString()) {

							assert.file([
								path.join(tdir, 'app/assemble/no-scss.hbs'),
								path.join(tdir, 'app/sass/templates/_no-scss.scss')
							]);

							assert.fileContent(path.join(tdir, 'app/sass/templates/_assemble-templates.scss'), /@import\s+"home-page";\n@import\s+"test-template.scss";\n@import\s+"no-scss";/);

						}
					}
				}

				done();
			});

		});
	});

	it('Test copy.js capturing extraneous files', function (done) {

		let randoFile = Math.random().toString(36).substring(2, 15) + '.txt';
		let randoDir = Math.random().toString(36).substring(2, 15);

		let writeDir = path.join(tdir, randoDir);

		fs.writeFile(writeDir, 'test random file', function (err) {
			if (err) {
				throw err;
			}

			exec('npm run copy', {
				cwd: tdir
			}, function (error, stdout, stderr) {
				if (error !== null) {
					if (error.code !== null) {
						if ('0' !== error.code.toString()) {

							assert.file([
								path.join(tdir, 'dist/' + randoDir + '/' + randoFile)
							]);

						}
					}
				}

				done();
			});
		});

	});

});

