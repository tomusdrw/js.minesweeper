define(['_', 'backbone'], function(_, Backbone) {
	var ToolsView = Backbone.View.extend({

		el: '.game-tools',
		buttons : {
			'started' : '<i class="icon icon-reload"></i> Restart',
			'over' : '<i class="icon icon-play"></i> Start',
		},

		initialize : function() {
			this.model.on('change:gameState', this.renderRestart);
			this.model.on('change:minesLeft', this.renderMines);

			this.renderRestart();
			this.renderMines();
		},

		getButton : function (state) {
			var buttonText = this.buttons[state];
			if (!buttonText) {
				throw new Error("Unknown game state: "+state);
			}
			return buttonText;
		},

		renderRestart : function() {
			var state = this.model.getGameState();
			this.$('.restart-button').html(this.getButton(state));
		},

		renderMines : function() {
			var minesLeft = this.model.getMinesLeft();
			this.$('.mines-left').text(minesLeft);
		}
	});


	return ToolsView;
});
