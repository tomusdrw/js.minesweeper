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
				cell.on('change:state', this.calculateState, this);
			}, this);
		},

		calculateState : function (cell) {
			// calculate mines left
			var marked = this.getNoOfMarkedCells();
			this.set('minesLeft', this.get('mines') - marked);
			
			// check if there was some mine
			if (this.isGameOver()) {
				this.set('gameState', 'over');
			}
			
			// do a cascade open
			if (cell.getState() === cell.STATE.OPEN &&
				cell.getMines() === 0
			    ) {
				var position = cell.get('position');
				this.cascade(position.x, position.y, {});
			}
		},
		
		cascade : function (x, y, visited) {
			var neighs = this.getNeighbourhood(x, y);
			var cells = this.getCells();
			_.each(neighs, function(pos) {
				if (!visited[pos]) {
					cells[pos].open();
					visited[pos] = true;
					if (cells[pos].getMines() === 0) {
						this.cascade(pos[0], pos[1], visited);
					}
				}
			}, this);
		},
		
		isGameOver : function () {
			var mine = _.chain(this.getCells()).values().find(function(cell) {
				return cell.getState() === cell.STATE.MINE;
			}).value();
			return !!mine;
		},
		
		getNoOfMarkedCells : function () {
			var marked = _.chain(this.getCells()).values().filter(function(cell) {
				return cell.getState() === cell.STATE.MARKED;
			}).value().length;
			
			return marked;
		},

		start : function () {
			this.set('gameState', 'started');
			this.set('minesLeft', this.get('mines'));
			// Initialize mines
			// reset cells
			_.invoke(_.values(this.getCells()), 'reset');
			this.seedMines(this.get('mines'));
			this.calculateMinesInNeighbourhood();
		},
		
		getNeighbourhood : function (x, y) {
			var size = this.get('size');
			var xRange = _.range(Math.max(0, x-1), Math.min(size.x, x+2));
			var yRange = _.range(Math.max(0, y-1), Math.min(size.y, y+2));
			
			var neighs = [];
			_.each(xRange, function(x2) {
				_.each(yRange, function(y2) {
					if (x2 !== x || y2 !== y) {
						neighs.push([x2, y2]);
					}
				});
			});
			return neighs;
		},
		
		getNumberOfMines : function(x, y) {
			var cells = this.getCells();
			var mines = 0;
			_.each(this.getNeighbourhood(x, y), function(pos) {
				if (cells[pos].hasMine()) {
					mines++;
				}
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
					cells[[x, y]] = new CellModel({
						position: {
							x: x,
							y: y
						}
					});
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
		},
		isOver : function() {
			return this.getGameState() == 'over';
		}
	});

	return GameModel;
});
