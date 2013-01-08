define(['_', 'GameModel', 'CellModel'], function(_, GameModel, CellModel){
	describe("GameModel", function() {
		
		var cut = null;

		beforeEach(function() {
			cut = new GameModel();
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
