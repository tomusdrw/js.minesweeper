define(['backbone', '_'], function(Backbone, _) {
	var CellView = Backbone.View.extend({
		tagName : 'button',
		tIcon : _.template('<i class="icon-<%= icon %>"></i>'),

		events : {
			'click' : 'cellOpen',
			'contextmenu' : 'cellMark'
		},

		initialize : function (options) {
			this.game = options.game;
			this.$el.addClass('cell');

			this.model.on('change:state', this.render, this);
		},

		render : function () {
			var state = this.model.getState();
			var STATE = this.model.STATE;

			this.$el.addClass('open').removeClass('mine');
			var html = '';
			if (state == STATE.OPEN) {
				var neighs = this.model.getMines();
				if (neighs > 0) {
					html = neighs;
				}
			} else if (state == STATE.MARKED) {
				html = this.tIcon({icon : 'flag'});
				this.$el.removeClass('open');
			} else if (state == STATE.MINE) {
				this.$el.addClass('mine');
				html = this.tIcon({icon : 'asterisk'});
			} else {
				this.$el.removeClass('open');
			}
			
			this.$el.html(html);
		},

		cellOpen : function(ev) {
			if (this.game.isOver()) {
				return;
			}
			this.model.open();
		},
		cellMark : function(ev) {
			if (this.game.isOver()) {
				return;
			}
			this.model.mark();
			ev.preventDefault();
		}
	});

	return CellView;
});
