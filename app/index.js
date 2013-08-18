'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');

// The "magic" that starts the module and runs all the prototype functions in the order they are written
var BreiAppGenerator = module.exports = function BreiAppgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // Mocha is fine

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  if (!options['test-framework']) {
    options['test-framework'] = 'mocha';
  }

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });

  // Read in the index file so we can append stuff to it later
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));

  // Install bower stuff
  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  // Read in package info
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(BreiAppGenerator, yeoman.generators.Base);

BreiAppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
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
    }]},
    {
      type: 'input',
      name: 'Deploy directory (relative to current path)',
      value: 'deployDirectory',
      default: "../../deploy"
    }
  ];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    // this.useBootstrap = features.indexOf('useBootstrap') !== -1;
    this.includeSass = features.indexOf('includeSass') !== -1;
    // this.includeAngularJS = features.indexOf('includeAngularJS') !== -1;
    // this.includeRequireJS = features.indexOf('includeRequireJS') !== -1;
    this.autoprefixer = features.indexOf('autoprefixer') !== -1;

    cb();
  }.bind(this));
};

BreiAppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

BreiAppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

// We use SVN
//
// BreiAppGenerator.prototype.git = function git() {
//   this.copy('gitignore', '.gitignore');
//   this.copy('gitattributes', '.gitattributes');
// };

BreiAppGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

BreiAppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

// We don't care about this
//
// BreiAppGenerator.prototype.editorConfig = function editorConfig() {
//   this.copy('editorconfig', '.editorconfig');
// };
//
// or this
//
// BreiAppGenerator.prototype.h5bp = function h5bp() {
//   this.copy('favicon.ico', 'app/favicon.ico');
//   this.copy('404.html', 'app/404.html');
//   this.copy('robots.txt', 'app/robots.txt');
//   this.copy('htaccess', 'app/.htaccess');
// };

// BreiAppGenerator.prototype.bootstrapImg = function bootstrapImg() {
//   if (this.compassBootstrap) {
//     this.copy('glyphicons-halflings.png', 'app/img/glyphicons-halflings.png');
//     this.copy('glyphicons-halflings-white.png', 'app/img/glyphicons-halflings-white.png');
//   }
// };

// BreiAppGenerator.prototype.bootstrapJs = function bootstrapJs() {
//   // TODO: create a Bower component for this
//   if (this.useBootstrap) {
//     this.copy('bootstrap.js', 'app/js/vendor/bootstrap.js');
//   }
// };

BreiAppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  if (this.includeSass) {
    this.copy('main.scss', 'app/css/main.scss');
  } else {
    this.copy('main.css', 'app/css/main.css');
  }
};

BreiAppGenerator.prototype.writeIndex = function writeIndex() {
  // prepare default content text
  var defaults = ['HTML5 Boilerplate'];
  var contentText = [
    '        <div class="container">',
  ];

  // if (!this.includeRequireJS) {
  //   this.indexFile = this.appendScripts(this.indexFile, 'js/main.js', [
  //     'bower_components/jquery/jquery.js',
  //     'js/main.js'
  //   ]);

  //   this.indexFile = this.appendFiles({
  //     html: this.indexFile,
  //     fileType: 'js',
  //     optimizedPath: 'js/coffee.js',
  //     sourceFileList: ['js/hello.js'],
  //     searchPath: '.tmp'
  //   });
  // }

  // if (this.compassBootstrap) {
  //   defaults.push('Twitter Bootstrap');
  // }

  // if (this.compassBootstrap && !this.includeRequireJS) {
  //   // wire Twitter Bootstrap plugins
  //   this.indexFile = this.appendScripts(this.indexFile, 'js/plugins.js', [
  //     'bower_components/sass-bootstrap/js/bootstrap-affix.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-alert.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-dropdown.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-tooltip.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-modal.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-transition.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-button.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-popover.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-typeahead.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-carousel.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-scrollspy.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-collapse.js',
  //     'bower_components/sass-bootstrap/js/bootstrap-tab.js'
  //   ]);
  // }

  // if (this.includeRequireJS) {
  //   defaults.push('RequireJS');
  // }

  // iterate over defaults and create content string
  // defaults.forEach(function (el) {
  //   contentText.push('                    <li>' + el  +'</li>');
  // });

  contentText = contentText.concat([
    '        </div>',
    ''
  ]);

  // append the default content
  this.indexFile = this.indexFile.replace('<body>', '<body>\n' + contentText.join('\n'));
};

BreiAppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/js');
  this.mkdir('app/css');
  this.mkdir('app/css/i');
  this.mkdir('app/img');
  this.write('app/index.html', this.indexFile);

  this.write('app/js/main.js', '// Main JavaScript file');
  
};
