module.exports = function(grunt) {
    //section 1 - require modules
    require('load-grunt-tasks')(grunt);
 
    // section 2 - configure grunt
    grunt.initConfig({
        eslint: {
            options: {
                config: '.eslint.js',
                reset: true
            },
            target: ['WebApplication1/**/*.js']
        }
    });
 
    //section 3 - register grunt tasks
    grunt.registerTask('default', ['eslint']);
  
};


// grunt.initConfig({
//     eslint: {
//         options: {
//             configFile: 'conf/.eslintrc.js',
//         },
//         target: ['app.js']
//     }
// });