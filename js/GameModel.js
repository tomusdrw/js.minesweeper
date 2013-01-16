define(['backbone', '_', 'CellModel'], function(Backbone, _, CellModel) {
  var GameModel = Backbone.Model.extend({
    /**
     * This section provides default values for properties to all instances.
     */
    defaults : {
      mines : 25,
      size : {
        x : 10,
        y : 10
      },
      gameState : 'over'
    },
    /**
     * I like to explicilty say that class will have some variable inside
     */
    cells : null,

    initialize : function() {
      // When we change size we have to reinitialize model.
      this.on('change:size', this.initModel, this);
      // We also have to do it at start
      this.initModel();
    },

    initModel : function() {
      var size = this.get('size');

      this.cells = this.createCellModels(size);
      _.each(this.cells, function(cell) {
        // When cell state changes we need to recalculate some things.
        cell.on('change:state', this.calculateState, this);
      }, this);
    },

    calculateState : function(cell) {
      // calculate mines left
      var marked = this.getNoOfMarkedCells();
      this.set('minesLeft', this.get('mines') - marked);

      // check if there was some mine
      if (this.isGameOver()) {
        this.set('gameState', 'over');
      }

      // do a cascade open
      if (cell.getState() === cell.STATE.OPEN && cell.getMines() === 0) {
        var position = cell.get('position');
        this.cascade(position.x, position.y);
      }
    },

    /**
     * This method does cascade opening. When you click on empty cell, all
     * adjacent cells should be opened.
     */
    cascade : function(x, y) {
      var neighs = this.getNeighbourhood(x, y);
      var cells = this.getCells();
      _.each(neighs, function(pos) {
        // this will trigger next cascade
        cells[pos].open();
      }, this);
    },

    /**
     * This method should return neighbours of cell x,y. All neighbours indices
     * should exist (so do not return sth like [-1, 0]).
     * 
     * Neighbours are considered as adjacent by edge and corner (so regular cell
     * has 8 neighbours).
     * 
     * @param x
     * @param y
     * @returns {Array} of neighbours
     */
    getNeighbourhood : function(x, y) {
      var size = this.get('size');
      var xRange = _.range(Math.max(0, x - 1), Math.min(size.x, x + 2));
      var yRange = _.range(Math.max(0, y - 1), Math.min(size.y, y + 2));

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

    /**
     * Is used to determine if game should be stopped.
     * 
     * @returns true if there is any cell that is opened and has mine (is in
     *          STATE.MINE state)
     */
    isGameOver : function() {
      var mine = _.chain(this.getCells()).values().find(function(cell) {
        return cell.getState() === cell.STATE.MINE;
      }).value();
      return !!mine;
    },

    /**
     * This method returns number of marked cells on whole map.
     * 
     * @returns number of cells with state STATE.MARKED.
     */
    getNoOfMarkedCells : function() {
      var marked = _.chain(this.getCells()).values().filter(function(cell) {
        return cell.getState() === cell.STATE.MARKED;
      }).value().length;

      return marked;
    },

    /**
     * This method returns number of mines in neighbourhood of given x,y.
     * 
     * @param x
     * @param y
     * @returns {Number}
     */
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

    start : function() {
      this.set('gameState', 'started');
      this.set('minesLeft', this.get('mines'));
      // Initialize mines
      // reset cells
      _.invoke(_.values(this.getCells()), 'reset');
      this.seedMines(this.get('mines'));
      this.calculateMinesInNeighbourhood();
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
      _.chain(cells).shuffle().first(mines).each(function(cell) {
        cell.setMine();
      });
    },

    /**
     * This function gets size object ( { x: 10, y: 10} ) and returns map of
     * cells indexed by arrays [x, y].
     * 
     * For instance for size = { x: 2, y: 1} it should return { "[0, 0]" :
     * CellModel "[1, 0]" : CellModel }
     */
    createCellModels : function(size) {
      var cells = {};
      _.range(0, size.x).forEach(function(x) {
        _.range(0, size.y).forEach(function(y) {
          cells[[x, y]] = new CellModel({
            position : {
              x : x,
              y : y
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
