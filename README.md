jquery.continuousCssAnime
==================

transitionendやanimationendを使いアニメーションが終る度に連番でクラスをつけるjQuery Plugin


仕様
------
1. アニメーションが終る度にクラスを付与する
2. その付与したクラスにcssを与えることで連続して動きをつけることができる

使い方
------
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="js/jquery.continuousCssAnime.js"></script>


オプション
------

 * type : "animation" || "transition"
 * num : cssでアニメーションを繰り返す回数（クラス名にanimeNum6などでアニメーション回数を指定することもできます。）
 * name : アニメーションするときに付けるclass名 例 ) move1
 * onComplate : 全てのアニメーションが終わったときに実行する関数
 * 途中のcssアニメーションの終了時に処理を実行したい場合 例 ) 3回目の場合  anime3onComplate
 * event : false or btnContentに設定したいイベント
 * btnContent : hoverしたときに反応させたいコンテンツ
 *  animeReverse : mouseout時いままでつけてきたクラスを一つづつ外してアニメーションを一つづつ戻す

### 初期設定 ###

	type: "transition",
	num : 1,
	name : "move",
	onComplate:'',
	event : false,
	btnContent : this,
	animeReverse : false


例
------
### javascript ###
	$(".btn").continuousCssAnime({
		onComplate : function(){test()},
		event : "hover",
		animeReverse : true
	})
	
### html ###
	<p class="btn animeNum6"></p>

ライセンス
----------
+ Copyright 2014 &copy; kamem
+ [http://www.opensource.org/licenses/mit-license.php][mit]

[develo.org]: http://develo.org/ "develo.org"
[MIT]: http://www.opensource.org/licenses/mit-license.php