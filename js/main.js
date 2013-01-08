requirejs.config({
	paths : {
		'bootstrap' : 'vendor/bootstrap',
		'underscore' : 'vendor/underscore',
		'backbone' : 'vendor/backbone',
		'backbone.storage' : 'vendor/backbone.webStorage'
	},
	map : {
		'*' : {
			'_' : 'underscore'
		}
	},
	shim : {
		'underscore' : {
			exports : '_'
		},
		'backbone' : {
			deps : ['underscore', 'jquery'],
			exports : 'Backbone'
		},
		'backbone.storage' : {
			deps : ['backbone'],
			exports : 'Backbone'
		},
		'bootstrap' : {
			deps : ['jquery']
		}
	}
});
require(['jquery'], function ($) {
	

});
