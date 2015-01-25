(function(){

	// Helpers (taken from lodash - https://github.com/lodash/lodash/blob/master/lodash.js)
	var isFunction = function(value) {
		return typeof value === 'function' || false;
	};
	// fallback for older versions of Chrome and Safari
	if (isFunction(/x/)) {
		isFunction = function(value) {
			return typeof value === 'function' && window.toString.call(value) === '[object Function]';
		};
	}
	// Extend the object by adding all properties from the source to the destination
	function extend (destination, source) {
		for (var property in source) {
			if (source.hasOwnProperty(property)) {
				destination[property] = source[property];
			}
		}
		return destination;
	}


	function isPrivate(name) {
		return name.toString().search('_') === 0;
	}

	function createPublicMethod(func, methods) {
		return function() {
			var i, method, ret,
				temp_store = {};

			// Publics (make sure the original function is set appropriately)
			for (i = 0; (method = methods.p[i]); ++i) {
				temp_store['__'+method.n] = this[method.n];
				this[method.n] = method.f;
			}

			// Privates
			for (i = 0; (method = methods._p[i]); ++i) {
				this[method.n] = method.f;
			}

			ret = func.apply(this, arguments);

			// Publics
			for (i = 0; (method = methods.p[i]); ++i) {
				this[method.n] = temp_store['__'+method.n];
			}

			// Privates
			for (i = 0; (method = methods._p[i]); ++i) {
				delete this[method.n];
			}

			return ret;
		};
	}

	var JSObj = function() {
		var JS_ = this;

		JS_.extend = function(object, _data) {
			_data = _data || {};
			var properties = Object.keys(object),
				methods = extend({
					p: [],
					_p: []
				}, _data.methods),
				variables = extend({
					p: [],
					_p: []
				}, _data.variables);

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

			for (var j = 0, method; (method = methods.p[j]); ++j) {
				FuncPrototype[method.n] = createPublicMethod(method.f, methods);
			}

			// Making inheritance possible
			Func.extend = function(object){
				return JS_.extend.call(this, object, {
					methods: methods,
					variables: variables
				});
			};

			return Func;
		};

		return JS_;
	};

	window.JS_ = new JSObj();

})();