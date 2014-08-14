'use strict';
var fs = require('fs');
module.exports = function(grunt) {
  // commenting this out for now until used
  //var dist = '' + (process.env.SERVER_BASE || 'dist_dev');
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    files: {
      html: {
        src: 'src/index.html'
      },
      js: {
        src: [
          'src/modules/*/*.js',
          'src/app.js'
        ]
      },
      templates: {
        src: 'src/**/*.html'
      },
      less: {
        src: [
          'src/css/style.less'
        ]
      }
    },
    compress: {
      win: {
        options: {
          archive: 'built/kalabox-win-dev.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/Kalabox/win/',
            src: ['**'],
            dest: 'Kalabox/'
          }
        ]
      },
      osx: {
        options: {
          archive: 'built/kalabox-osx-dev.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/Kalabox/osx/',
            src: ['**'],
            dest: 'Kalabox/'
          }
        ]
      },
      linux32: {
        options: {
          archive: 'built/kalabox-linux32-dev.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/Kalabox/linux32/',
            src: ['**'],
            dest: 'Kalabox/'
          }
        ]
      },
      linux64: {
        options: {
          archive: 'built/kalabox-linux64-dev.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/Kalabox/linux64/',
            src: ['**'],
            dest: 'Kalabox/'
          }
        ]
      }
    },
    bower: {
      install: {
        options: {
          targetDir: './src/lib/vendor'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: ['Gruntfile.js', '<%= files.js.src %>']
    },
    jscs: {
      src: ['Gruntfile.js', '<%= files.js.src %>'],
      options: {
        config: '.jscsrc'
      }
    },
    less: {
      options: {
        paths: ['src/css'],
        ieCompat: false
      },
      dev: {
        src: '<%= files.less.src %>',
        dest: 'src/css/style.css'
      },
      dist: {
        options: {
          cleancss: true,
          compress: true
        },
        src: '<%= files.less.src %>',
        dest: 'src/css/style.css'
      }
    },
    watch: {
      options: {
        livereload: false
      },
      less: {
        files: ['<%= files.less.src %>'],
        tasks: ['less:dev']
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            src: ['src/**'],
            dest: 'generated/'
          },
          {src: ['package.json'], dest: 'generated/package.json'}
        ]
      }
    },
    clean: {
      workspaces: ['built', 'dist', 'generated', 'src/downloads']
    },
    nodewebkit: {
      options: {
        // Versions listed here: http://dl.node-webkit.org/
        version: 'v0.10.1',
        platforms: ['win', 'osx', 'linux32', 'linux64'],
        buildDir: 'dist'
      },
      src: ['generated/**/**']
    },
    /**
     * Karma unit test runner.
     */
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      // Required by grunt, can override later.
      unit: {},
      ci: {
        options: {
          singleRun: true,
          browsers: ['PhantomJS']
        }
      }
    }
  };

  // initialize task config
  grunt.initConfig(config);

  // load local tasks
  if (fs.exists('tasks.js')) { grunt.loadTasks('tasks'); }

  // loads all grunt-* tasks based on package.json definitions
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  // create workflows
  grunt.registerTask('default', [
    'bower',
    'jshint',
    'karma:unit',
    'less:dev',
    'watch'
  ]);

  grunt.registerTask('test', [
    'bower',
    'jshint',
    'jscs',
    'karma:ci'
  ]);

  grunt.registerTask('build', [
    'clean',
    'bower',
    'jshint',
    'jscs',
    'less:dist',
    'copy',
    'nodewebkit',
    'compress:win',
    'compress:osx',
    'compress:linux32',
    'compress:linux64'
  ]);
};
