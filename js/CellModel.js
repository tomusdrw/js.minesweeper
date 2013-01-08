define(['backbone'], function(Backbone) {
	var CellModel = Backbone.Model.extend({
		STATE : {
			CLOSED : '',
			OPEN : 'O',
			MARKED : 'M',
			MINE : 'X'
		},
		defaults : {
			state : '',
			hasMine : false,
			mines : 0
		},

		open : function() {
			if (!this.isClosed()) {
				return;
			}
			// Do not open marked cells.
			if (this.getState() === this.STATE.MARKED) {
				return;
			}
			var newState;
			if (this.hasMine()) {
				newState = this.STATE.MINE;
			} else {
				newState = this.STATE.OPEN;
			}
			this.set('state', newState);
		},

		mark : function() {
			if (!this.isClosed()) {
				return;
			}
			this.set('state', this.STATE.MARKED);
		},

		setMine : function() {
			this.set('hasMine', true);
		},

		isClosed : function() {
			return this.getState() === this.STATE.CLOSED;
		},

		getMines : function () {
			return this.get('mines');
		},
		getState : function () {
			return this.get('state');
		},
		hasMine : function () {
			return this.get('hasMine');
		}
	});

	return CellModel;
});
