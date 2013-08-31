/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe('brei-app generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('brei-app:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'package.json',
      'bower.json',
      '.bowerrc',
      '.jshintrc',
      'Gruntfile.js',
      'index.html',
      'js/main.js',
      'bower_components/jquery/jquery.js',
      'css/main.css',
      'app/css/normalize.css'
    ];

    helpers.mockPrompt(this.app, {
      features: ['autoprefixer','spriteCSS'],
      deployDirectory: '../../deploy'
    });
    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
