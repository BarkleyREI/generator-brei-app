module.exports = function(grunt, options){
  return {
	  server: {
	    path: 'http://localhost:<%= connect.options.port %>'
	  }
	}
};