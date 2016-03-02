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
					"node_modules/buttercup-web/build/buttercup.js",
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
            admin_static: {
                files: [
					{
						expand: true,
						src: ["source/admin/index.html"],
						dest: "dist/admin/",
						flatten: true
					}
				]
            },
            admin_react: {
				files: [
					{
						expand: true,
						src: ["node_modules/react/dist/react-with-addons*"],
						dest: "dist/admin/",
						flatten: true
					}
				]
			},
			buttercup: {
				files: [
					{
						expand: true,
						src: ["node_modules/buttercup-web/build/buttercup.min.js"],
						dest: "dist/",
						flatten: true
					}
				]
			},
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
			},
			popup_static: {
				files: [
					{
						expand: true,
						src: ["source/popup/index.html"],
						dest: "dist/popup/",
						flatten: true
					}
				]
			},
			popup_react: {
				files: [
					{
						expand: true,
						src: ["node_modules/react/dist/react-with-addons*"],
						dest: "dist/popup/",
						flatten: true
					}
				]
			}
		},

		exec: {
            pack_admin: {
                cmd: `webpack -p --colors --config ${__dirname}/source/admin/webpack.config.js`
            },
			pack_popup: {
				cmd: `webpack -p --colors --config ${__dirname}/source/popup/webpack.config.js`
			}
		},

		notify: {
			built: {
				options: {
					title: "Build complete",
					message: "Full extension build has completed",
				}
			}
		},

		sass: {
			options: {
				sourceMap: false
			},
            admin: {
                files: {
                    "dist/admin/styles.css": "source/admin/styles/index.scss"
                }
            },
			popup: {
				files: {
                    "dist/popup/styles.css": "source/popup/styles/index.scss"
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
		"copy:fonts",
		"copy:images",
		"copy:buttercup",
        "copy:admin_static",
        "exec:pack_admin",
        "copy:admin_react",
        "sass:admin",
		"build-popup",
		"notify:built"
	]);

	grunt.registerTask("build-popup", function() {
		// setupJadeForClient();
		grunt.task.run([
			"sass:popup",
			"exec:pack_popup",
			"copy:popup_react",
			"copy:popup_static"
		]);
	});

};
