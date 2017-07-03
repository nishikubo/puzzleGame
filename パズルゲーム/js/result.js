/*
 * runstant
 */

phina.globalize();

var ASSETS = {
  // 画像
  image: {
    //'img1': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko.png',
    'img1': 'http://localhost:8080/img/penguin/backGround.jpg',
  },
};

phina.define('MainScene', {
  superClass: 'CanvasScene',

  init: function() {
    this.superInit();

    var anySprite = Sprite('img1').addChildTo(this);

    anySprite.scaleX =3.0;
    anySprite.scaleY =3.0;

    var result_data = location.search.substring(1, location.search.length);
      //エスケープされた文字をアンエスケープする
    result_data = unescape(result_data);


    var st=localStorage;
    var data1=10;
    var data2=30;
    var data3=50;

    st.setItem('no1',data1);
    st.setItem('no2',data2);
    st.setItem('no3',data3);

    if(data1>result_data)
    {
      data1=result_data;
      st.setItem('no1',data1);
    }
    else if (data1<=result_data && data2>result_data) {
      data2=result_data;
      st.setItem('no2',data2);
    }
    else if(data2<=result_data){
      data3=result_data;
      st.setItem('no3',data3);
    }


    var result1=st.getItem('no1');
    var result2=st.getItem('no2');
    var result3=st.getItem('no3');
    console.log(result1);
    console.log(result2);
    console.log(result3);
    console.log(st.length);


    var label = Label("クリアまでにかかった回数は " + result_data + " 回です。").addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
    label.fontSize = 32;

    var labe2 = Label("1位 " + result1 + " 回").addChildTo(this);
    labe2.x = this.gridX.center();
    labe2.y = this.gridY.span(10);
    labe2.fontSize = 32;

    var labe3 = Label("2位 " + result2 + " 回").addChildTo(this);
    labe3.x = this.gridX.center();
    labe3.y = this.gridY.span(11);
    labe3.fontSize = 32;

    var labe4 = Label("3位 " + result3 + " 回").addChildTo(this);
    labe4.x = this.gridX.center();
    labe4.y = this.gridY.span(12);
    labe4.fontSize = 32;



    //document.write("<h1>ランキング</h1>");
    //document.write("1位 " + result1 + " 回<br>");
    //document.write("2位 " + result2 + " 回<br>");
    //document.write("3位 " + result3 + " 回<br><br>");


    var titleButton = Button({
      text: 'タイトルへ',
    }).addChildTo(this).setPosition(this.gridX.center(),this.gridY.span(14));
    titleButton.onpush=function(){
      document.location.href="title.html?";
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
