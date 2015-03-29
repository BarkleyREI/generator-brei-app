module.exports = function(grunt, options){
  return {
	  dist: {
	    files: [{
	      expand: true,
	      cwd: '<%= yeoman.app %>/img',
	      src: '{,*/}*.svg',
	      dest: '<%= yeoman.dist %>/img'
	    }]
	  }
	}
};