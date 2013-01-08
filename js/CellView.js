define(['backbone', '_'], function(Backbone, _) {
	var CellView = Backbone.View.extend({
		tagName : 'button',
		tIcon : _.template('<i class="icon-<%= icon %>"></i>'),

		initialize : function () {
			this.$el.addClass('cell');

			this.model.on('change:state', this.render);
		},

		render : function () {
			var state = this.model.get('state');
			var STATE = this.model.STATE;

			this.$el.addClass('open');
			var html = '';
			if (state == STATE.OPEN) {
				var neighs = this.model.get('neighbours');
				if (neighs > 0) {
					html = neighs;
				}
			} else if (state == STATE.MARKED) {
				html = this.tIcon('flag');
			} else if (state == STATE.MINE) {
				html = this.tIcon('asterisk');
			} else {
				this.$el.removeClass('open');
			}
			
			this.$el.html(html);
		}
	});

	return CellView;
});
