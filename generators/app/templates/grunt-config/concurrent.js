module.exports = function(grunt, options){
  return {
	  server: ['compass:server', 'copy:styles'],
	  test: ['copy:styles'],
	  dist: ['compass:dist', 'copy:styles', 'imagemin', 'svgmin', 'htmlmin']
	}
};