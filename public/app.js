(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("controllers/List", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _servicesGringotts = require("../services/gringotts");

var _servicesGringotts2 = _interopRequireDefault(_servicesGringotts);

var ListController = {

  app: null,
  gringotts: null,

  init: function init(app) {
    this.app = app;

    // load services
    this.gringotts = this.app.service.load(_servicesGringotts2["default"]);

    return this;
  },

  load: function load() {
    var res = { items: null };

    this.gringotts.list().then(function (keys) {
      res.items = keys;
      console.log('keys', keys);
    });

    return res;
  },

  unload: function unload() {
    this.app = undefined;
  }

};

exports["default"] = ListController;
module.exports = exports["default"];
});

require.register("passwordPie", function(exports, require, module) {
"use strict";

// lib
Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _amaretti = require("amaretti");

// controllers

var _amaretti2 = _interopRequireDefault(_amaretti);

var _controllersList = require("./controllers/List");

// views

var _controllersList2 = _interopRequireDefault(_controllersList);

var _viewsList = require("./views/list");

// Service singleton system

var _viewsList2 = _interopRequireDefault(_viewsList);

var ServiceManager = function ServiceManager(app) {
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
			controller: _controllersList2["default"],
			view: _viewsList2["default"]
		}
	},
	currentRoute: null,
	service: null,

	init: function init() {

		// Load service manager
		this.service = new ServiceManager(this);

		// Declare events
		window.addEventListener('hashchange', function (newUrl) {
			App.routeChange(window.location.hash);
		}, false);

		_amaretti2["default"].getSalt().then(function (salt) {
			console.log('App salted ', salt);
		});

		App.routeChange(window.location.hash);
	},

	routeChange: function routeChange(route) {

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

exports["default"] = App;
module.exports = exports["default"];
});

require.register("services/gringotts", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _roundabout = require("./roundabout");

/**
 * This module needs to be run as a singleton!
 *
 * This module get data from roundabout service and manage crypto to get
 * human readable informations
 *
 * It had to be a singleton because it store passphrase to uncrypt data
 */

var _roundabout2 = _interopRequireDefault(_roundabout);

var Gringotts = {

  _name_: 'gringott',
  roundabout: null,
  app: null,

  init: function init(app) {
    this.app = app;

    // load services
    this.app.service.load(_roundabout2["default"]);

    return this;
  },

  // TODO: manage encryption

  list: function list(path) {
    return _roundabout2["default"].list(path);
  },

  read: function read(path) {
    return _roundabout2["default"].read(path);
  },

  write: function write(path, data) {
    return _roundabout2["default"].write(path, data);
  }
};

exports["default"] = Gringotts;
module.exports = exports["default"];
});

require.register("services/roundabout", function(exports, require, module) {
/*global localforage:false */

"use strict";

/**
 * This module needs to be run as a singleton!
 *
 * This module get data from differents sources (local, cloud...)
 * It had to be a singleton because this module manage open connections
 * to remote services
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
var Roundabout = {

  _name_: 'roundabout',
  app: null,

  init: function init(app) {
    this.app = app;

    return this;
  },

  list: function list(path) {
    // TODO filter with path
    return localforage.keys();
  },

  read: function read(path) {
    return localforage.getItem(path);
  },

  write: function write(path, data) {
    return localforage.setItem(path, data);
  }
};

exports["default"] = Roundabout;
module.exports = exports["default"];
});

require.register("views/done", function(exports, require, module) {
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<li> end: "
    + escapeExpression(lambda(depth0, depth0))
    + "</li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<h2>Things to done</h2>\n\n<ul class=\"tasks\" id=mainTodo>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.items : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>\n";
},"useData":true});
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/list", function(exports, require, module) {
var __templateData = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "		<li> cool: "
    + escapeExpression(lambda(depth0, depth0))
    + "</li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<h2>Things to do</h2>\n\n<ul class=\"tasks\" id=mainTodo>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.items : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>\n";
},"useData":true});
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map