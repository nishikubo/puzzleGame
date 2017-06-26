// phina.js をグローバル領域に展開
phina.globalize();

// アセット
var ASSETS = {
  // 画像
  image: {
    //'img1': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko.png',
    'img1': 'http://localhost:8080/img/p1.jpg',
    'img2': 'http://localhost:8080/img/p2.jpg',
    'img3': 'http://localhost:8080/img/p3.jpg',
    'img4': 'http://localhost:8080/img/p4.jpg',
    'img5': 'http://localhost:8080/img/p5.jpg',
    'img6': 'http://localhost:8080/img/p6.jpg',
    'img7': 'http://localhost:8080/img/p7.jpg',
    'img8': 'http://localhost:8080/img/p8.jpg',
    'img9': 'http://localhost:8080/img/p9.jpg',
    'img10': 'http://localhost:8080/img/p10.jpg',
    'img11': 'http://localhost:8080/img/p11.jpg',
    'img12': 'http://localhost:8080/img/p12.jpg',
    'img13': 'http://localhost:8080/img/p13.jpg',
    'img14': 'http://localhost:8080/img/p14.jpg',
    'img15': 'http://localhost:8080/img/p15.jpg',
  },
};

// 定数
var SCREEN_WIDTH = 640;            // 画面横サイズ
var SCREEN_HEIGHT = 960;           // 画面縦サイズ
var GRID_SIZE = SCREEN_WIDTH / 4;  // グリッドのサイズ
var PIECE_SIZE = GRID_SIZE * 0.95; // ピースの大きさ
var PIECE_NUM_XY = 4;              // 縦横のピース数
var PIECE_OFFSET = GRID_SIZE / 2;  // オフセット値

//クリアまでに移動させた回数を格納する変数
var clear_move = 0;
//シャッフルボタンを押したかの判定
var shuffle_bool = false;

// メインシーン
phina.define('MainScene', {
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit();
    // 背景色
    this.backgroundColor = 'gray';
    // グリッド
    var grid = Grid(SCREEN_WIDTH, PIECE_NUM_XY);
    // ピースグループ
    var pieceGroup = DisplayElement().addChildTo(this);
    var self = this;
    // ピース配置
    PIECE_NUM_XY.times(function(spanX) {
      PIECE_NUM_XY.times(function(spanY) {
        // 番号
        var num = spanY * PIECE_NUM_XY + spanX + 1;
        // ピース作成
        var piece = Piece(num).addChildTo(pieceGroup);
        // Gridを利用して配置
        piece.x = grid.span(spanX) + PIECE_OFFSET;
        piece.y = grid.span(spanY) + PIECE_OFFSET;

        // 正解の位置を記憶させておく
        piece.correctX = piece.x;
        piece.correctY = piece.y;

        // タッチを有効にする
        piece.setInteractive(true);
        // タッチされた時の処理
        piece.onpointend = function() {
          // ピース移動処理
          self.movePiece(this);
        };
        // 16番のピースは非表示
        if (num === 16) piece.hide();
      });
    });
    // シャッフルボタン
    var shuffleButton = Button({
      text: 'シャッフル',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(13));
    // ボタンプッシュ時処理
    shuffleButton.onpush = function() {
      // ピースをシャッフル
      (100).times(function() {
        //シャッフルボタンを押した判定をtrueに
        shuffle_bool = true;
        self.shufflePieces();
      });
    };
    // 参照用
    this.pieceGroup = pieceGroup;
    this.shuffleButton = shuffleButton;
  },
  // 16番ピース（空白）を取得
  getBlankPiece: function() {
    var result = null;
    this.pieceGroup.children.some(function(piece) {
      // 16番ピースを結果に格納
      if (piece.num === 16) {
        result = piece;
        return true;
      }
    });
    return result;
  },
  // ピースの移動処理
  movePiece: function(piece, isInstantly) {


    // 空白ピースを得る
    var blank = this.getBlankPiece();
    // 即入れ替え
    if (isInstantly) {
      var tmpX = piece.x;
      var tmpY = piece.y;
      piece.setPosition(blank.x, blank.y);
      blank.setPosition(tmpX, tmpY);
      return;
    }
    // x, yの座標差の絶対値
    var dx = Math.abs(piece.x - blank.x);
    var dy = Math.abs(piece.y - blank.y);
    // 隣り合わせの判定
    if ((piece.x === blank.x && dy === GRID_SIZE) ||
        (piece.y === blank.y && dx === GRID_SIZE)) {
      // タッチされたピース位置を記憶
      var touchX = piece.x;
      var touchY = piece.y;
      var self = this;
      // tweenerで移動処理
      piece.tweener.clear()
                   .to({x: blank.x, y: blank.y}, 200, "easeOutCubic")
                   .call(function() {
                     // 空白ピースをタッチされたピースの位置へ
                     blank.setPosition(touchX, touchY);

                     //移動回数を増加
                     clear_move++;

                     // クリアチェック
                     //if (self.shuffleButton.isPushed) self.checkPiecePosition();
                     //シャッフルボタンを押したあとならクリア判定を行う
                     if (shuffle_bool == true) self.checkPiecePosition();
                     //if (clear_move >= 3) self.checkPiecePosition();
                   });
    }
  },

  // クリア判定
checkPiecePosition: function() {
  //シーン移動テスト
  //if(clear_move == 5) document.location.href="result.html?" + escape(clear_move);
  //シーン移動テストキーボードのキーのどれかが押されたらリザルトへ移動する
  //URLに移動させた回数を付けてリザルトで使えるようにする
  document.onkeydown = function()
  {
    document.location.href="result.html?" + escape(clear_move);
  }

  // 正しくない位置のピースがあるかチェックする
  var result = this.pieceGroup.children.some(function(piece) {
    if (piece.x != piece.correctX || piece.y != piece.correctY) return true;
  });
  // 全て正しい位置ならクリア画面へ
  //var score = this.step;
  if (!result) {
    //document.location.href="result.html";
    document.location.href="result.html?" + escape(clear_move);
    //if(clear_move == 5) document.location.href="result.html?" + escape(clear_move);

    /*this.exit({
      score: score,
      message: '15 Puzzle Clear!'
    });*/
  }
},


  // 指定の位置のピースを返す
  getPieceByXY: function(x, y) {
    var result = null;
    this.pieceGroup.children.some(function(piece) {
      // 指定した座標なら
      if (piece.x === x && piece.y === y) {
        result = piece;
        return true;
      }
    });
    return result;
  },
  // ピースをシャッフルする
  shufflePieces: function() {
    var self = this;
    // 隣接ピース格納用
    var pieces = [];
    // 空白ピースを得る
    var blank = this.getBlankPiece();
    // 上下左右隣りのピースがあれば配列に追加
    [1, 0, -1].each(function(i) {
      [1, 0, -1].each(function(j) {
        if (i != j) {
          var x = blank.x + i * GRID_SIZE;
          var y = blank.y + j * GRID_SIZE;
          var target = self.getPieceByXY(x, y);
          if (target) pieces.push(target);
        }
      });
    });
    // 隣接ピースからランダムに選択して空白ピースと入れ替える
    this.movePiece(pieces.random(), 'instantly');
    pieces.clear();
  },
});
// ピースクラス
phina.define('Piece', {
  // RectangleShapeを継承
  superClass: 'phina.display.RectangleShape',
    // コンストラクタ
    init: function(num) {
      // 親クラス初期化
      this.superInit({
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        cornerRadius: 10,
        fill: 'silver',
        stroke: 'white',
      });
      // 数字
      this.num = num;

      // 数字表示用ラベル
      /*this.label = Label({
        text: this.num + '',
        fontSize: PIECE_SIZE * 0.8,
        fill: 'white',
      }).addChildTo(this);*/


      //パズルの画像を張り付ける
      //ローカルでは画像が表示されないのでvagrantにフォルダを作って画像を読み込む
      if(this.num == 1) { this.sprite = Sprite('img1').addChildTo(this); }
      if(this.num == 2) { this.sprite = Sprite('img2').addChildTo(this); }
      if(this.num == 3) { this.sprite = Sprite('img3').addChildTo(this); }
      if(this.num == 4) { this.sprite = Sprite('img4').addChildTo(this); }
      if(this.num == 5) { this.sprite = Sprite('img5').addChildTo(this); }
      if(this.num == 6) { this.sprite = Sprite('img6').addChildTo(this); }
      if(this.num == 7) { this.sprite = Sprite('img7').addChildTo(this); }
      if(this.num == 8) { this.sprite = Sprite('img8').addChildTo(this); }
      if(this.num == 9) { this.sprite = Sprite('img9').addChildTo(this); }
      if(this.num == 10) { this.sprite = Sprite('img10').addChildTo(this); }
      if(this.num == 11) { this.sprite = Sprite('img11').addChildTo(this); }
      if(this.num == 12) { this.sprite = Sprite('img12').addChildTo(this); }
      if(this.num == 13) { this.sprite = Sprite('img13').addChildTo(this); }
      if(this.num == 14) { this.sprite = Sprite('img14').addChildTo(this); }
      if(this.num == 15) { this.sprite = Sprite('img15').addChildTo(this); }

    },
});
// メイン
phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    // アセット読み込み
    assets: ASSETS,
  });
  app.run();
});
