define(['backbone'], function(Backbone) {
	var CellModel = Backbone.Model.extend({
		STATE : {
			CLOSED : '',
			OPEN : 'O',
			MARKED : 'M',
			MINE : 'X'
		},
		defaults : {
			state : ''
		}
	});

	return CellModel;
});
