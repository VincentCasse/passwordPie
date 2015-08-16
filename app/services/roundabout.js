/*global localforage:false */

"use strict";

/**
 * This module needs to be run as a singleton!
 *
 * This module get data from differents sources (local, cloud...)
 * It had to be a singleton because this module manage open connections
 * to remote services
 */
var Roundabout = {

  _name_: 'roundabout',
  app: null,

  init: function (app) {
    this.app = app;

    return this;
  },

  list: function (path) {
    // TODO filter with path
    return localforage.keys();
  },

  read: function (path) {
    return localforage.getItem(path);
  },

  write: function (path, data) {
    return localforage.setItem(path, data);
  }
};

export default Roundabout;
