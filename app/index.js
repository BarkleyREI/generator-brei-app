'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var brei = require('brei-junk');

var BreiAppGenerator = module.exports = function BreiAppGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	// Get our BREI utilities (if any)
	this.brei = brei;

	// resolved to mocha by default (could be switched to jasmine for instance)
	this.hookFor('mocha', {
		as: 'app'
	});
	
	// Install bower stuff
	this.on('end', function () {
		this.installDependencies({
			skipInstall: options['skip-install']
		});
	});

	// Set app version
	this.appversion = "0.0.0";

	// Read in package info
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(BreiAppGenerator, yeoman.generators.Base);

BreiAppGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// welcome message
	console.log(this.brei.logo());
	console.log(this.yeoman);
	console.log('Out of the box I include HTML5 Boilerplate, jQuery (1.x) and Modernizr.');

	var prompts = [{
		type: 'checkbox',
		name: 'features',
		message: 'What more would you like?',
		choices: [{
			name: 'Use SASS/Compass',
			value: 'includeSass',
			checked: false
		}, {
			name: 'Autoprefixer for your CSS',
			value: 'autoprefixer',
			checked: true
		}, {
			name: 'Sprite images in CSS folder (css/i)',
			value: 'spriteCSS',
			checked: true
		}]
	}, {
		type: 'input',
		name: 'deployDirectory',
		message: 'Deploy directory (relative to current path)',
		default: "../../deploy"
	}];

	this.prompt(prompts, function (answers) {
		var features = answers.features;
		var deployDirectory = answers.deployDirectory;

		// manually deal with the response, get back and store the results.
		// we change a bit this way of doing to automatically do this in the self.prompt() method.
		this.includeSass = features.indexOf('includeSass') !== -1;
		this.autoprefixer = features.indexOf('autoprefixer') !== -1;
		this.spriteCSS = features.indexOf('spriteCSS') !== -1 && !this.includeSass;
		this.deployDirectory = deployDirectory;

		cb();
	}.bind(this));
};

BreiAppGenerator.prototype.gruntfile = function gruntfile() {
	this.template('Gruntfile.js');
};

BreiAppGenerator.prototype.packageJSON = function packageJSON() {
	this.template('_package.json', 'package.json');
};

BreiAppGenerator.prototype.bower = function bower() {
	this.copy('bowerrc', '.bowerrc');
	this.copy('_bower.json', 'bower.json');
};

BreiAppGenerator.prototype.jshint = function jshint() {
	this.copy('jshintrc', '.jshintrc');
};

BreiAppGenerator.prototype.writeIndex = function writeIndex() {

	// Read in the index file so we can append stuff to it later
	if (this.includeSass) {
		this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index_sass.html'));
	} else {
		this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
	}

	// prepare default content text
	var defaults = ['HTML5 Boilerplate'];
	var contentText = [
		'        <div class="container">',
		'            <h1>Hello World!</h1>'
	];

	contentText = contentText.concat([
		'        </div>',
		''
	]);

	// append the default content
	this.indexFile = this.indexFile.replace('<body>', '<body>\n' + contentText.join('\n'));
};

BreiAppGenerator.prototype.addJQuery = function jshint() {

	this.indexFile = this.appendScripts(this.indexFile, 'js/main.js', [
		'bower_components/jquery/jquery.js'
	]);

};

BreiAppGenerator.prototype.mainStylesheets = function mainStylesheet() {
	if (!this.includeSass) {
		this.copy('main.css', 'app/css/main.css');
		this.copy('normalize.css', 'app/css/normalize.css');
	}
};

BreiAppGenerator.prototype.app = function app() {
	this.mkdir('app');
	this.mkdir('app/js');
	
	if (this.spriteCSS) {
		this.mkdir('app/css/i'); // Used for sprite images. Optional
	}

	// adds additional directories for sass
	if (this.includeSass) {
		var cb = this.async();

		this.remote('BarkleyREI', 'sass_boilerplate', function (err, remote) {
			if (err) {
				return cb(err);
			}

			remote.directory('.', 'app/sass');

			cb();
		});		

	} else {
		this.mkdir('app/css');
	}

	this.write('app/index.html', this.indexFile);

	this.mkdir('app/img');
	if (this.includeSass) {
		this.copy('rocket.png', 'app/img/rocket.png');
	}

	this.write('app/js/main.js', '// Main JavaScript file');

};