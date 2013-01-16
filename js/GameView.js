define(['_', 'backbone', 'CellView'], function(_, Backbone, CellView) {
  var GameView = Backbone.View.extend({
    el : '.game-canvas',

    initialize : function() {
      this.model.on('change:size', this.createCellViews, this);

      this.createCellViews();
    },

    createCellViews : function() {
      var cells = this.model.getCells();

      var cellViews = _.map(cells, function(cell) {
        var view = new CellView({
          model : cell,
          game : this.model
        });
        return view.$el;
      }, this);

      this.$el.empty();
      this.$el.append(cellViews);
    }

  });

  return GameView;
});
