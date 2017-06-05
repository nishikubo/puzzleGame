/*
 * runstant
 */

phina.globalize();

phina.define('MainScene', {
  superClass: 'CanvasScene',
  
  init: function() {
    this.superInit();
    
    var label = Label('Hello, phina.js!').addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
    label.fontSize = 64;
    
    var shape = StarShape().addChildTo(this);
    shape.setPosition(100, 100);
  },
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
  });
  
  app.run();
});
