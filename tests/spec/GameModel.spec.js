define(['_', 'GameModel', 'CellModel'], function(_, GameModel, CellModel){
	describe("GameModel", function() {
		
		var cut = null;

		beforeEach(function() {
			cut = new GameModel();
		});

		describe('Getters', function() {
			it('should return number of mines left', function () {
				// given
				cut.set('minesLeft', 5);

				// when
				var left = cut.getMinesLeft();
				
				// then
				expect(left).to.equal(5);
			});

			it('should return game state' , function() {
				// given
				cut.set('gameState', 'started');

				// when
				var state = cut.getGameState();
				
				// then
				expect(state).to.equal('started');

			});
		});

		describe('Starting game', function() {
			it('should change game state when invoking start', function() {
				// given
				expect(cut.get('gameState')).to.be.equal('over');

				// when
				cut.start();
				
				// then
				expect(cut.get('gameState')).to.be.equal('started');
			});

			it('should initialize mines randomly', function() {
				// given
				cut.set('mines', 2);
				cut.set('size', { x: 2, y: 2});

				// when
				cut.start();
				var cells = cut.getCells();
				var withMines = _.filter(cells, function(cell) {
					return cell.hasMine();
				});

				// then
				expect(withMines).to.have.length(2);
			});

			it('should calculate mines in neigbourhood', function() {
				// given
				cut.set('size', { x: 3, y : 3 });
				var cells = cut.getCells();
	
				// when
				cells[[0,0]].setMine();
				cells[[2,0]].setMine();
				cells[[2,1]].setMine();
				cells[[2,2]].setMine();

				cut.calculateMinesInNeighbourhood();

				// then
				expect(cells[[0,0]].getMines()).to.be.equal(0);
				expect(cells[[1,0]].getMines()).to.be.equal(3);
				expect(cells[[2,0]].getMines()).to.be.equal(1);

				expect(cells[[0,1]].getMines()).to.be.equal(1);
				expect(cells[[1,1]].getMines()).to.be.equal(4);
				expect(cells[[2,1]].getMines()).to.be.equal(2);

				expect(cells[[0,2]].getMines()).to.be.equal(0);
				expect(cells[[1,2]].getMines()).to.be.equal(2);
				expect(cells[[2,2]].getMines()).to.be.equal(1);
			});
		});
		
		describe("Game step methods", function() {
		
			beforeEach(function () {
				cut.set('size', {
					x: 3,
					y: 3
				});
			});
			it('should calculate marked cells when there is none', function() {
				// given
				var cells = cut.getCells();
				
				// when
				
				// then
				expect(cut.getNoOfMarkedCells()).to.equal(0);
			});
			
			it('should calculate marked cells when there is none', function() {
				// given
				var cells = cut.getCells();
				
				// when
				cells[[1, 1]].mark();
				
				// then
				expect(cut.getNoOfMarkedCells()).to.equal(1);
			});
		
			it('should calculate number of marked cells', function() {
				// given
				var cells = cut.getCells();
				
				// when
				cells[[0, 0]].mark();
				cells[[0, 1]].mark();
				cells[[1, 1]].mark();
				
				// then
				expect(cut.getNoOfMarkedCells()).to.equal(3);
			});
			
			it('should return false at the beggining', function () {
				// given

				// when
				var over = cut.isGameOver();
				
				// then
				expect(over).to.be.false;
			});
			
			it('should return true when cell is opened on mine', function () {
				// given
				var cell = cut.getCells();
				cell[[0,0]].setMine();
				cell[[0,0]].open();
				
				// when
				var over = cut.isGameOver();
				
				// then
				expect(over).to.be.true;
			});
		});
		
		describe("Neighbourhood", function() {
		
		});
		
		describe("Cascade", function() {
			it('should cascade open empty cells', function() {
				// given
				cut.set('size', { x: 3, y : 3});
				var cells = cut.getCells();
				
				// when
				cells[[0, 0]].set('mines', 0);
				cells[[0, 1]].set('mines', 0);
				cells[[0, 2]].set('mines', 0);
				cells[[1, 0]].set('mines', 0);
				cells[[1, 1]].set('mines', 2);
				cells[[1, 2]].set('mines', 3);
				cells[[2, 0]].set('mines', 1);
				cells[[2, 1]].set('mines', 1);
				
				cut.cascade(0, 0, {});
				
				// then
				expect(cells[[0, 0]].isClosed()).to.be.false;
				expect(cells[[0, 1]].isClosed()).to.be.false;
				expect(cells[[0, 2]].isClosed()).to.be.false;
				expect(cells[[1, 0]].isClosed()).to.be.false;
				expect(cells[[1, 1]].isClosed()).to.be.false;
				expect(cells[[1, 2]].isClosed()).to.be.false;
				expect(cells[[2, 0]].isClosed()).to.be.false;
				expect(cells[[2, 1]].isClosed()).to.be.false;
	
				expect(cells[[2, 2]].isClosed()).to.be.true;
			});
		
		});

		describe("creating CellModels (createCellModels)", function() {
			it('should create empty object', function() {
				// given
				var size = {
					x : 0,
					y : 1
				};
				
				// when
				var model = cut.createCellModels(size);
				

				// then
				expect(model).to.be.a('object');
				expect(model).to.be.empty;
			});

			it('should create single cell', function() {
				// given
				var size = {
					x : 1,
					y : 1
				};
				
				// when
				var model = cut.createCellModels(size);
				

				// then
				expect(model).to.be.a('object');
				expect(model[[0, 0]]).to.be.an.instanceof(CellModel);
			});

			it('should create some cells', function() {
				// given
				var size = {
					x : 2,
					y : 2
				};
				var keys = [
					[0, 0], [1, 0], [0, 1], [1, 1]
				];
				
				// when
				var model = cut.createCellModels(size);
				

				// then
				expect(model).to.be.a('object');
				keys.forEach(function(key) {
					expect(model[key]).to.be.an.instanceof(CellModel);
				});
			});

		});
	});
});
