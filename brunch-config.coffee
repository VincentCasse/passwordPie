module.exports = config:

	files:
		javascripts: 
			joinTo: 
				'app.js': /^(app)/
				'vendor.js': /^(vendor|bower_components|node_modules)/
		stylesheets: joinTo: 'app.css'
		templates: joinTo: 'app.js'

	plugins:
		jshint:
			pattern: /^app\/.*\.js$/
			options:
				bitwise: false
				curly: true
				node: true
				esnext: true
			globals:
				jQuery: true
				window: true
				global: true
				btoa: true
				Uint8Array: true
				require: true
				console: true
				module: true
				Promise: true
				document: true
				warnOnly: true
		babel:
			ignore: [
				/^(bower_components|vendor|node_modules)/
			]
		handlebars:
			include:
				runtime: false 


