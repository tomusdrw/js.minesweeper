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
