module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({

        clean: {
            dist: ["dist/*", "!dist/.gitignore"]
        },

        concat: {
            options: {
                separator: ";"
            },
            dist_background: {
                src: [
                    "source/misc/header.js",
                    "source/background/**/*.js",
                    "source/misc/footer.js"
                ],
                dest: "dist/background.js"
            },
            dist_tab: {
                src: [
                    "source/misc/header.js",
                    "source/tab/**/*.js",
                    "source/misc/footer.js"
                ],
                dest: "dist/tab.js"
            }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask("default", ["build"]);

    grunt.registerTask("build", [
        "clean",
        "concat"
    ]);

};
