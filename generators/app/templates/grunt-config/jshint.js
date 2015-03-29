module.exports = function(grunt, options){
  return {
    options: {
      jshintrc: '.jshintrc'
    },
    all: ['Gruntfile.js',
      '<%= yeoman.app %>/js/{,*/}*.js',
      '!<%= yeoman.app %>/js/plugins.js',
      '!<%= yeoman.app %>/js/plugins/*',
      '!<%= yeoman.app %>/js/vendor/*',
      'test/spec/{,*/}*.js'
    ]
  }
};