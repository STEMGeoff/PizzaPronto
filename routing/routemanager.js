var routing = require('./routing'),
	simple = require('../routes/simple'),
	complex = require('../routes/complex');

var RouteManager = function() {
	function _registerRoutes(){
		routing.AddRoute('/simple', simple.simpleRoute);
		routing.AddRoute('/complex', complex.complexRoute);
	}
	return {
		RegisterRoutes: _registerRoutes
	};
}();

module.exports = RouteManager;