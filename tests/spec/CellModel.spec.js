define(['_', 'CellModel'], function(_, CellModel) {
	describe('CellModel', function() {
		var cut = null;

		beforeEach(function() {
			cut = new CellModel();
		});

		describe('Getters', function(){
			
			it('should return number of mines', function() {
				// given
				cut.set('mines', 5);
				
				// when
				var mines = cut.getMines();
				
				// then
				expect(mines).to.be.equal(5);
			});

			it('should return state', function() {
				// given
				cut.set('state', cut.STATE.MINE);
				
				// when
				var state = cut.getState();
				
				// then
				expect(state).to.be.equal(cut.STATE.MINE);
			
			});

			it('should return if it has mine', function() {
				// given
				cut.set('hasMine', true);
				
				// when
				var hasMine = cut.hasMine();
				
				// then
				expect(hasMine).to.be.true;

			});
		});

		describe('Mines', function() {
			it('should seed mine to cell', function() {
				// given
				expect(cut.hasMine()).to.be.false;

				// when
				cut.setMine();

				// then
				expect(cut.hasMine()).to.be.true;
			});
		});

		describe('State', function() {
			it('should allow to open closed cell', function() {
				// given
				expect(cut.getState()).to.be.equal(cut.STATE.CLOSED);

				// when
				cut.open();
				
				
				// then
				expect(cut.getState()).to.be.equal(cut.STATE.OPEN);
			});
			it('should allow to mark closed cell', function() {
				// given
				expect(cut.getState()).to.be.equal(cut.STATE.CLOSED);

				// when
				cut.mark();
				
				// then
				expect(cut.getState()).to.be.equal(cut.STATE.MARKED);
			});

			it('should not allow to mark opened cell', function() {
				// given
				cut.open();

				// when
				cut.mark();
				
				// then
				expect(cut.getState()).to.be.equal(cut.STATE.OPEN);
			});

			it('should change state to MINE if hasMine and opened', function() {
				// given
				cut.set('hasMine', true);

				// when
				cut.open();
				
				// then
				expect(cut.getState()).to.be.equal(cut.STATE.MINE);
			});

			it('should not allow to open marked cell', function() {
				// given
				cut.mark();

				// when
				cut.open();
				
				// then
				expect(cut.getState()).to.be.equal(cut.STATE.MARKED);
			});

			it('should return isClosed when closed', function() {

				// then
				expect(cut.isClosed()).to.be.true;
			});
		});
		
	});
});
