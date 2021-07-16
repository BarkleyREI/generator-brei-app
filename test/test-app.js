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

/**
 * Test basic file generation,
 * including that from brei-assemble-structure, brei-handlebars-helpers, brei-sass-boilerplate.
 */

describe('Generator Functionality', function () {
	'use strict';

	let tmdir = path.join(os.tmpdir(), './temp/brei-gen-modern');
	let tpdir = path.join(os.tmpdir(), './temp/brei-gen-pattern');

	before(function mainGenerator(done) {
		this.timeout(300000);

		console.log('\nRunning a generator with npm install. This might take a while...\n\n');

		helpers.run(path.join(__dirname, '../generators/new'))
			.inDir(tmdir)
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
					cwd: tmdir
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

	before(function patternGenerator(done) {
		this.timeout(300000);

		console.log('\nRunning a pattern generator with npm install. This might take a while...\n\n');

		helpers.run(path.join(__dirname, '../generators/pattern'))
			.inDir(tpdir)
			.withOptions({
				'skip-install': false
			})
			.withPrompts({
				'deployDirectory': 'web'
			})
			.on('end', function () {
				console.log('\nRunning npm run scaffold and npm run build');
				console.log('------------');
				console.log('Buckle up, this might take 45 - 60 seconds\n');

				exec('npm run scaffold && npm run build', {
					cwd: tpdir
				}, function (error, stdout, stderr) {
					if (error !== null) {
						if (error.code !== null) {
							if ('0' !== error.code.toString()) {
								pbuild_error_code = error.code;
								pbuild_error_msg = error.message;
								pbuild_error_stdout = stdout;
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

	// We can't run these tests since everything is geared around the modern generator, not legacy.
	//
	// it('Partial (Legacy) Sub-Generator', function () {
	// 	util._test_sub_generators('partial', tdir);
	// });
	//
	// it('Module (Legacy) Sub-Generator', function () {
	// 	util._test_sub_generators('module', tdir);
	// });

	it('[Modern] Test updateScss.js', function (done) {
		let filePath = path.join(tmdir, 'app/assemble/no-scss.hbs');

		fs.writeFile(filePath, 'no-scss', function (err) {
			if (err) {
				throw err;
			}

			exec('npm run assemble:execute', {
				cwd: tmdir
			}, function (error, stdout, stderr) {
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

	// it('[Modern] Test copy.js capturing extraneous files', function (done) {
	//
	// 	let randoFile = Math.random().toString(36).substring(2, 15) + '.txt';
	// 	let randoDir = Math.random().toString(36).substring(2, 15);
	//
	// 	let writeDir = path.join(tmdir, randoDir);
	//
	// 	fs.writeFile(writeDir, 'test random file', function (err) {
	// 		if (err) {
	// 			throw err;
	// 		}
	//
	// 		exec('npm run copy', {
	// 			cwd: tmdir
	// 		}, function (error, stdout, stderr) {
	// 			if (error !== null) {
	// 				if (error.code !== null) {
	// 					if ('0' !== error.code.toString()) {
	//
	// 						assert.file([
	// 							path.join(tmdir, 'dist/' + randoDir + '/' + randoFile)
	// 						]);
	//
	// 					}
	// 				}
	// 			}
	//
	// 			done();
	// 		});
	// 	});
	//
	// });
	//
	// it('[Pattern] Test copy.js capturing extraneous files', function (done) {
	//
	// 	let randoFile = Math.random().toString(36).substring(2, 15) + '.txt';
	// 	let randoDir = Math.random().toString(36).substring(2, 15);
	//
	// 	let writeDir = path.join(tpdir, randoDir);
	//
	// 	fs.writeFile(writeDir, 'test random file', function (err) {
	// 		if (err) {
	// 			throw err;
	// 		}
	//
	// 		exec('npm run copy', {
	// 			cwd: tpdir
	// 		}, function (error, stdout, stderr) {
	// 			if (error !== null) {
	// 				if (error.code !== null) {
	// 					if ('0' !== error.code.toString()) {
	//
	// 						assert.file([
	// 							path.join(tpdir, 'dist/' + randoDir + '/' + randoFile)
	// 						]);
	//
	// 					}
	// 				}
	// 			}
	//
	// 			done();
	// 		});
	// 	});
	//
	// });

});

