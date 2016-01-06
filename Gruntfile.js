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
                    "node_modules/lockr/lockr.js",
                    "node_modules/lamd/source/lamd.js",
                    "source/misc/header.js",
                    "source/background/**/*.js",
                    "source/misc/footer.js"
                ],
                dest: "dist/background.js"
            },
            dist_tab: {
                src: [
                    "node_modules/lamd/source/lamd.js",
                    "source/misc/header.js",
                    "source/tab/**/*.js",
                    "source/misc/footer.js"
                ],
                dest: "dist/tab.js"
            }
        },

        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        src: ["resources/*.ttf"],
                        dest: "dist/",
                        flatten: true
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        src: ["resources/*.svg"],
                        dest: "dist/",
                        flatten: true
                    }
                ]
            }
        },

        jade: {
            popup: {
                files: {
                    "dist/": ["source/popup/popup.jade"]
                },
                options: {
                    client: false,
                    wrap: false
                }
            }
        },

        sass: {
            options: {
                sourceMap: false
            },
            popup: {
                files: {
                    "dist/popup.css": "source/popup/popup.scss"
                }
            }
        },

        watch: {
            all: {
                files: [
                    "source/**/*",
                    "resources/**/*"
                ],
                tasks: ["build"],
                options: {
                    spawn: false
                }
            }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask("default", ["build"]);

    grunt.registerTask("build", [
        "clean",
        "concat",
        "jade",
        "sass:popup",
        "copy:fonts",
        "copy:images"
    ]);

};
