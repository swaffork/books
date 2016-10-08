// Grunt configurations for running our server

module.exports = function(grunt) {
	grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
		nodemon: {
			dev: {
				script: 'src/server.js'
			}
		},

	// validate js files:
	jshint: {
		options: {
			reporter: require('jshint-stylish')
		},
		build: ['gruntfile.js', 'src']
	}
	});

	// Load & register nodemon
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.registerTask('default', ['nodemon']);
};
