"use strict";

import amaretti from "amaretti";

var App = {
	items: ['Learn', 'Test'],

	init: function init() {

		// Declare events
		window.addEventListener('hashchange', function(newUrl) {
			App.routeChange(window.location.hash);
		}, false);

		amaretti.getSalt().then(function (salt) {
			console.log('App salted ', salt);
		});

		App.routeChange(window.location.hash);

	},

	routeChange: function(route) {

		if (!route) {
			route = 'list';
		} else {
			route = route.substring(1);
		}

		var template = require('views/'+route);
		document.querySelector('content').innerHTML = template({items: App.items });
	}
};

export default App;
