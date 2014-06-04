var Talker = JS_.extend({
		sayHello: function() {
			console.log('hello');
		},
		_sayGoodbye: function() {
			console.log('goodbye');
		},
		sayHelloAndGoodbye: function() {
			this.sayHello();
			this._sayGoodbye();
		},
		sayDelayedGoodbye: function() {
			var self = this,
				_sayGoodbye = self._sayGoodbye;
			setTimeout(function(){
				_sayGoodbye();
			}, 1000);
		}
	}),
	talker = new Talker();

talker.sayHello(); // console.log('hello');
talker.sayHelloAndGoodbye(); // console.log('hello'); console.log('goodbye');
talker.sayDelayedGoodbye();
// talker._sayGoodbye(); // throws error