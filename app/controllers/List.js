"use strict";

import gringotts from "../services/gringotts";

var ListController = {

  app: null,
  gringotts: null,

	init: function (app) {
    this.app = app;

    // load services
    this.gringotts = this.app.service.load(gringotts);

    return this;
	},

  load: function () {
    var res = { items: null };

    this.gringotts.list().then(function (keys) {
      res.items = keys;
      console.log('keys', keys);
    });

    return res;
  },

  unload: function() {
    this.app = undefined;
  }

};

export default ListController;
