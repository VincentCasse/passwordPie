"use strict";

// lib
import amaretti from "amaretti";

// controllers
import ListController from "./controllers/List";

// views
import ListView from "./views/list";

// Service singleton system
var ServiceManager = function (app) {
	this.app = app;
	this.services = {};
};
ServiceManager.prototype.load = function (service) {
	if (this.services[service._name_] === undefined) {
		this.services[service._name_] = service.init(this.app);
	}
	return this.services[service._name_];
};

var App = {
	items: ['Learn', 'Test'],
	routing: {
		'list': {
			controller: ListController,
			view: ListView
		}
	},
	currentRoute: null,
	service: null,

	init: function () {

		// Load service manager
		this.service = new ServiceManager(this);

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

		// Unload old controller
		if (this.currentRoute) {
			this.routing[this.currentRoute].unload();
		}

		if (!route) {
			route = 'list';
		} else {
			route = route.substring(1);
		}

		var ctrl = this.routing[route].controller.init(this);
		document.querySelector('content').innerHTML = this.routing[route].view(ctrl.load());
	}
};

export default App;
