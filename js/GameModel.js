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
			this.set('minesLeft', this.get('mines'));
			// Initialize mines
			this.seedMines(this.get('mines'));
			this.calculateMinesInNeighbourhood();
		},

		getNumberOfMines : function(x, y) {
			var size = this.get('size');
			var xRange = _.range(Math.max(0, x-1), Math.min(size.x, x+2));
			var yRange = _.range(Math.max(0, y-1), Math.min(size.y, y+2));
			
			var cells = this.getCells();
			var mines = 0;
			_.each(xRange, function(x2) {
				_.each(yRange, function(y2) {
					if (x2 !== x || y2 !== y) {
						if (cells[[x2, y2]].hasMine()) {
							mines++;
						}
					}
				});
			});

			return mines;
		},

		calculateMinesInNeighbourhood : function() {
			var size = this.get('size');
			var cells = this.getCells();
			_.each(_.range(0, size.x), function(x) {
				_.each(_.range(0, size.y), function(y) {
					var mines = this.getNumberOfMines(x, y);
					cells[[x, y]].set('mines', mines);
				}, this);
			}, this);
		},

		seedMines : function(mines) {
			var cells = _.values(this.getCells());
			_.chain(cells).
				shuffle().
				first(mines).
				each(function(cell) {
					cell.setMine();
				});
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
