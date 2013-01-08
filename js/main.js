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
require(['GameModel', 'GameView', 'ToolsView',], function (GameModel, GameView, ToolsView) {
	var model = {
		size : {
			x : 10,
			y: 10
		},
		mines: 25
	};

	var gameModel = new GameModel(model);

	var gameView = new GameView({ model : gameModel });
	var toolsView = new ToolsView({ model : gameModel });
});
