/*
 * runstant
 */

phina.globalize();

var ASSETS = {
  // 画像
  image: {
    'img1': 'http://localhost:8080/img/penguin/backGround.jpg',
  },
};


phina.define('MainScene', {
  superClass: 'CanvasScene',

  init: function() {
    this.superInit();

    var anySprite = Sprite('img1').addChildTo(this);

    anySprite.scaleX=3.0;
    anySprite.scaleY=3.0;

    var label = Label('絵合わせパズル').addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
    label.fontSize = 64;

    var titleButton = Button({
      text: 'スタート',
    }).addChildTo(this).setPosition(this.gridX.center(),this.gridY.span(13));
    titleButton.onpush=function(){
      document.location.href="main.html?";
    }
  },
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    assets: ASSETS,
  });

  app.run();
});
