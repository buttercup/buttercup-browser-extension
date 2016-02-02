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
			pack_popup: {
				cmd: `webpack -p --progress --colors --config ${__dirname}/source/popup/webpack.config.js`
			}
		},

		sass: {
			options: {
				sourceMap: false
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
		"build-popup"
	]);

	grunt.registerTask("build-popup", function() {
		// setupJadeForClient();
		grunt.task.run([
			"sass:popup",
			"exec:pack_popup",
			"copy:popup_react",
			"copy:popup_static"
			// "jade:popup",
			// "copy:popup_js"
		]);
	});

};
