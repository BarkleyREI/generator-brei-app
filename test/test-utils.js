/*global describe, before, it*/

'use strict';

const util = require('../lib/utils.js');
const assert = require('yeoman-assert');

describe('Testing Util _format_input()', function () {
	context('test name', function () {
		it('= test-name', function () {
			let input = util._format_input('test name');
			assert.textEqual(input, 'test-name');
		});
	});
	context('Test Name With More Words', function () {
		it('= test-name-with-more-words', function () {
			let input = util._format_input('Test Name With More Words');
			assert.textEqual(input, 'test-name-with-more-words');
		});
	});
	context('test_name', function () {
		it('= test-name', function () {
			let input = util._format_input('test_name');
			assert.textEqual(input, 'test-name');
		});
	});
	context('_test_name', function () {
		it('= test-name', function () {
			let input = util._format_input('_test_name');
			assert.textEqual(input, 'test-name');
		});
	});
	context('--test-name.hbs', function () {
		it('= test-name', function () {
			let input = util._format_input('--test-name.hbs');
			assert.textEqual(input, 'test-name');
		});
	});
	context('__test-name.hbs', function () {
		it('= test-name', function () {
			let input = util._format_input('__test-name.hbs');
			assert.textEqual(input, 'test-name');
		});
	});
	context('__test-name.hbs--', function () {
		it('= test-name', function () {
			let input = util._format_input('__test-name.hbs--');
			assert.textEqual(input, 'test-name');
		});
	});
	context('__test-name.hbs -- kd', function () {
		it('= test-name', function () {
			let input = util._format_input('__test-name.hbs -- kd');
			assert.textEqual(input, 'test-name');
		});
	});
});