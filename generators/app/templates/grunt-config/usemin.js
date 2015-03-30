module.exports = function(grunt, options){
  return {
	  options: {
	    dirs: ['<%= yeoman.dist %>']
	  },
	  html: ['<%= yeoman.dist %>/{,*/}*.html'],
	  css: ['<%= yeoman.dist %>/css/{,*/}*.css']
	}
};