define(['backbone', '_', 'CellModel'], function(Backbone, _, CellModel) {
	var GameModel = Backbone.Model.extend({
		defaults : {
			mines : 25,
			size : {
				x : 10,
				y : 10
			},
			gameState : 'over'
		},

		cells : null,
		
		initialize : function () {
			this.on('change:size', this.initModel);
			this.initModel();
		},

		initModel : function() {
			var size = this.get('size');

			this.cells = this.createCellModels(size);
			_.each(this.cells, function(cell) {
				cell.on('change:state', this.calculateState);
			}, this);
		},

		start : function () {
			this.set('gameState', 'started');
		},

		
		
		/**
		 * This function gets size object ( { x: 10, y: 10} ) and returns
		 * map of cells indexed by arrays [x, y].
		 *
		 * For instance for size = { x: 2, y: 1}
		 * it should return
		 * {
		 *  "[0, 0]" : CellModel
		 *  "[1, 0]" : CellModel
		 * }
		 */
		createCellModels : function(size) {
			var cells = {};
			_.range(0, size.x).forEach(function(x) {
				_.range(0, size.y).forEach(function(y) {
					cells[[x, y]] = new CellModel();
				});
			});
			return cells;
		},

		getCells : function() {
			return this.cells;
		},
		getGameState : function() {
			return this.get('gameState');
		},
		getMinesLeft : function() {
			return this.get('minesLeft');
		}
	});

	return GameModel;
});
