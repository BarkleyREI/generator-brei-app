module.exports = function(grunt, options){
  return {
    options: {
      sassDir: '<%= yeoman.app %>/sass',
      cssDir: '.tmp/css',
      generatedImagesDir: '.tmp/img/generated',
      imagesDir: '<%= yeoman.app %>/img',
      javascriptsDir: '<%= yeoman.app %>/js',
      fontsDir: '<%= yeoman.app %>/sass/fonts',
      importPath: '<%= yeoman.app %>/bower_components',
      httpImagesPath: '/img',
      httpGeneratedImagesPath: '/img/generated',
      httpFontsPath: '/sass/fonts',
      relativeAssets: false,
      outputStyle: 'compact',
      debugInfo: false
    },
    dist: {
      options: {
        generatedImagesDir: '<%= yeoman.dist %>/img/generated',
        debugInfo: false,
        outputStyle: 'compressed'
      }
    },
    server: {
      options: {
        debugInfo: true
      }
    }
  }
};