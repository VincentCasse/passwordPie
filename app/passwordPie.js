"use strict";

import amaretti from "amaretti";
import tmpl from "views/list";

var App = {
	items: ['Learn', 'Test'],

	init: function init() {
		var html = document.createElement('div');
		html.innerHTML = tmpl({items: App.items }); 
		amaretti.getSalt().then(function (salt) {
			console.log('App salted ', salt);
		});
		document.querySelector('body').appendChild(html);
	}
};

export default App;
