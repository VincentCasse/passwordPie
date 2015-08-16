"use strict";

import roundabout from "./roundabout";

/**
 * This module needs to be run as a singleton!
 *
 * This module get data from roundabout service and manage crypto to get
 * human readable informations
 *
 * It had to be a singleton because it store passphrase to uncrypt data
 */
var Gringotts = {

  _name_: 'gringott',
  roundabout: null,
  app: null,

  init: function (app) {
    this.app = app;

    // load services
    this.app.service.load(roundabout);

    return this;
  },

  // TODO: manage encryption

  list: function (path) {
    return roundabout.list(path);
  },

  read: function (path) {
    return roundabout.read(path);
  },

  write: function (path, data) {
    return roundabout.write(path, data);
  }
};

export default Gringotts;
