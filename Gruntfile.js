module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower_concat: {
            all: {
                dest: 'public/javascripts/dist/_bower.js',
                cssDest: 'public/stylesheets/_bower.css',
                bowerOptions: {
                    relative: false
                }
            }
        },

        watch: {
            scripts: {
                files: ['**/*.js','!node_modules/**','!bower_components/**','!public/javascripts/dist/**'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            }
        },

        nodemon: {
            dev: {
                script: 'federa.js',
                ignore:  ['node_modules/**','bower_components/**','public/**']
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js','public/javascripts/app/**/*.js']

        },

        concat: {
            dist: {
                src:  'public/javascripts/app/**/*.js',
                dest: 'public/javascripts/dist/_app.js'
            }
        },

        bower : {
            install :{
                options: {
                    targetDir: 'bower_components'
                }

            }
        },

        karma : {
            unit : {
                options :{
                    files : ['tests/**/*.js']
                }
            }

        }
    });

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-task');
    // grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['dev']);
    grunt.registerTask('build', ['jshint','concat','bower_concat']);
    grunt.registerTask('dev', ['concurrent']);

    //heroku tasks
    // grunt.registerTask('heroku:production', ['bower:install','concat', 'bower_concat']);

};