(function(){

	// Helpers (taken from lodash - https://github.com/lodash/lodash/blob/master/lodash.js)
	function isFunction(value) {
		return typeof value == 'function' || false;
	}
	// fallback for older versions of Chrome and Safari
	if (isFunction(/x/)) {
		isFunction = function(value) {
			return typeof value == 'function' && toString.call(value) == '[object Function]';
		};
	}


	function isPrivate(name) {
		return name.toString().search('_') === 0;
	}

	function createPublicMethod(func, methods) {
		return function() {
			var i, method;

			// Publics
			for (i = 0; (method = methods.p[i]); ++i) {
				this['__'+method.n] = this[method.n];
				this[method.n] = method.f;
			}

			// Privates
			for (i = 0; (method = methods._p[i]); ++i) {
				this[method.n] = method.f;
			}

			func.apply(this, arguments);

			// Publics
			for (i = 0; (method = methods.p[i]); ++i) {
				this[method.n] = this['__'+method.n];
				delete this['__'+method.n];
			}

			// Privates
			for (i = 0; (method = methods._p[i]); ++i) {
				delete this[method.n];
			}
		};
	}

	var JSObj = function() {
		var JS_ = this;

		JS_.extend = function(object) {
			var properties = Object.keys(object),
				methods = {
					p: [],
					_p: []
				},
				variables = {
					p: [],
					_p: []
				};

			// Sort methods / variables and public / private
			for (var i = 0, name; (name = properties[i]) ; ++i) {
				if (isFunction(object[name])) {
					methods[(isPrivate(name) ? '_p' : 'p')].push({
						n: name,
						f: object[name]
					});
				} else {
					variables[(isPrivate(name) ? '_p' : 'p')].push({
						n: name,
						f: object[name]
					});
				}
			}

			var Func = function(){},
				FuncPrototype = Func.prototype;

			for (var i = 0, method; (method = methods.p[i]); ++i) {
				FuncPrototype[method.n] = createPublicMethod(method.f, methods);
			}

			return Func;
		};

		return JS_;
	};

	window.JS_ = JSObj();

})();