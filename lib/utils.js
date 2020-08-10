/*global describe, before, it*/

'use strict';

const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const path = require('path');
const brei = require('brei-util');
const u = require('util');
const os = require('os');
const _ = require('lodash');

/**
 * TEST UTILITIES
 **/
const _set_vars = module.exports._set_vars = function (name, type) {

	let fullName = 'test-' + name;
	let prefixedFullName = fullName;

	switch (type) {
		case 'organism':
		case 'module':
			prefixedFullName = '_' + fullName;
			break;
		default:
			break;
	}

	let hbsPath = type === 'template' ?
		'app/assemble/' + fullName + '.hbs' :
		'app/assemble/' + type + 's/' + prefixedFullName + '.hbs';

	let scssPath = 'app/scss/' + type + 's/_' + fullName + '.scss';

	let hbsRegx = new RegExp('class\=".*(test-' + name + ').*"');
	let scssRegx = new RegExp('\.test-' + name);

	return {
		fullName: fullName,
		hbsPath: hbsPath,
		scssPath: scssPath,
		hbsRegx: hbsRegx,
		scssRegx: scssRegx
	};
};

const _it_tests = module.exports._it_tests = function (vars, type, dir) {
	it('Created ' + vars.fullName + '.hbs and ' + vars.fullName + '.scss', function () {
		assert.file([
			path.join(dir, vars.hbsPath),
			path.join(dir, vars.scssPath)
		]);
	});

	if (type !== 'module' && type !== 'organism') {
		it(vars.fullName + ' .hbs have the right content', function () {
			assert.fileContent([
				[vars.hbsPath, vars.hbsRegx]
			]);
		});
	}
	it(vars.fullName + ' .scss have the right content', function () {
		assert.fileContent([
			[vars.scssPath, vars.scssRegx]
		]);
	});

};

const _test_sub_generators = module.exports._test_sub_generators = function (name, dir) {
	let vars = _set_vars(name, name);

	if (typeof dir === 'undefined' || dir === null) {
		dir = path.join(os.tmpdir(), './temp');
	}

	let tdir = dir;

	describe('Create new ' + name, function () {
		before(function subGenerator(done) {
			helpers.run(path.join(__dirname, '../generators/' + name))
				.inDir(tdir)
				.withPrompts({
					name: 'test ' + name
				})
				.on('end', function () {
					done();
				});
		});

		_it_tests(vars, name, tdir);
	});
};

const _test_patterns = module.exports._test_patterns = function (name) {
	var vars = _set_vars('pattern-' + name, name);

	describe('Import ' + name + ' Pattern', function () {
		before(function pattern(done) {
			helpers.run(path.join(__dirname, '../generators/pattern'))
				.withPrompts({
					type: name,
					name: 'test-pattern-' + name
				})
				.on('end', done);
		});

		_it_tests(vars, 'pattern');
	});
};

/**
 * GENERATOR UTILITIES
 **/
const _format_input = module.exports._format_input = function (input) {

	// Remove any file extensions
	if (/\..+/g.test(input)) {
		input = input.replace(/\..+/g, '');
	}

	input = _.kebabCase(input);

	input = input.toLowerCase();

	return input;
};
