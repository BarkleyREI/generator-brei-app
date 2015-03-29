module.exports = function(grunt, options){
  return {
	  options: {
	    dest: '<%= yeoman.dist %>'
	  },
	  html: '<%= yeoman.app %>/index.html'
	}
};