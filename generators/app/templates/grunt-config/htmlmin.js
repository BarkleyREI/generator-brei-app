module.exports = function(grunt, options){
  return {
	  dist: {
	    options: {},
	    files: [{
	      expand: true,
	      cwd: '<%= yeoman.app %>',
	      src: '*.html',
	      dest: '<%= yeoman.dist %>'
	    }]
	  }
	}
};