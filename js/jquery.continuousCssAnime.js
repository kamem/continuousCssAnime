/**
 *	jQuery continuousCssAnime.
 *	jQuery required.
 *	
 *	* Copyright 2014 (c) kamem
 *	* http://develo.org/
 *	* Licensed Under the MIT.
 *	
 *	Date: 2014.01.26
 *
 *	* type : "animation" || "transition"
 *	* num : cssでアニメーションを繰り返す回数（クラス名にanimeNum6などでアニメーション回数を指定することもできます。）
 *	* name : アニメーションするときに付けるclass名
 *	* 例 ) move1
 *
 *	* onComplate : 全てのアニメーションが終わったときに実行する関数
 *
 *	* 途中のcssアニメーションの終了時に処理を実行したい場合
 *	* 例 ) 3回目の場合
 *	* anime3onComplate
 *
 *	* event : false or btnContentに設定したいイベント
 *	* btnContent : hoverしたときに反応させたいコンテンツ
 *	 
 *	*  animeReverse : mouseout時いままでつけてきたクラスを一つづつ外してアニメーションを一つづつ戻す
 *
 * @class continuousCssAnime
 *
 */

(function($){

$.fn.continuousCssAnime = function(options) {
	$content = this;
	var c = $.extend({
		type: "transition",
		num : 1,
		name : "move",
		onComplate:'',
		event : false,
		btnContent : $content,
		animeReverse : false
	},options);

	var name = c.name,
		num = c.num,
		onComplate = c.onComplate,
		type = c.type,
		event = c.event,
		btnContent = c.btnContent;

	var userAgent = navigator.userAgent.toLowerCase();
	var animationend = 
		(!(userAgent.indexOf("webkit") == -1)) ? ((type == "transition") ? "webkitTransitionEnd" : "webkitAnimationEnd") : 
		(!(userAgent.indexOf("gecko") == -1)) ? ((type == "transition") ? "transitionend" : "animationend") :
		(!(userAgent.indexOf("opera") == -1)) ? ((type == "transition") ? "oTransitionEnd" : "oAnimationend") :
		(!(userAgent.indexOf("MSIE 10.0") == -1)) ? ((type == "transition") ? "MSTransitionEnd" : "MSAnimationend") : "";

	var outReverse = false;

	//アニメーションしたいコンテンツが複数指定されている場合の配列
	var animation = {};

	//それぞれのイベントリスナーの追加と削除
	var eventListener = {
		add : function(i) {
			if(animation[i].callee) {
				$content.eq(i)[0].addEventListener(animationend, animation[i].callee,false);
			}
			else {
				$content.eq(i)[0].addEventListener(animationend, function(e){animation[i].callee = arguments.callee;ccssanime(e,i)},false);
			}
		},
		remove : function(i) {
				$content.eq(i)[0].removeEventListener(animationend, animation[i].callee,false);
		}
	};

	$content.each(function(i){
		animation[i] = {};
		//最初のクラス名取得
		animation[i].className = $(this)[0].className;
		//現在の数値
		animation[i].classNum = 1;

		//アニメーションする回数
		var animeNumString = 'animeNum';
		var animeNum = $(this)[0].className.indexOf(animeNumString) +  animeNumString.length;
		animation[i].num = 0 <= $(this)[0].className.indexOf(animeNumString) ? $(this)[0].className.substring(animeNum, animeNum + 1) : num;
		
		console.log($(this)[0].className.indexOf(animeNumString));
		
		//何番目のアニメーション終わったときに関数を実行するか
		animation[i].onCompArray = []
		for(var j = 1;j <= animation[i].num;j++) {
			if(c["anime" + j + "onComplate"]) {
				animation[i].onCompArray[j] = c["anime" + j + "onComplate"];
			};
		};

		//eventがfaluse意外の時
		if(event) {
			btnContent[event](function () {
				if(type == "animation") {
					if(($content.eq(i)[0].className == animation[i].className) ||  0 < $content.eq(i)[0].className.indexOf(name + "allend")) {
						$content.eq(i).removeClass(name + "allend");
						$content.eq(i).addClass(name + animation[i].classNum);
			
						eventListener.add(i);
					}
				}
				else {
						outReverse = false;
						$content.eq(i).removeClass(name + "allend");
						$content.eq(i).addClass(name + animation[i].classNum);
			
						eventListener.add(i);
				}
				
			}, function () {
				if((type == "animation") && (event == "hover")) {
					if(0 < $content.eq(i)[0].className.indexOf(name + "allend")) {
						eventListener.remove(i);
					}
				}
				else {
					if(c.animeReverse && (type == "transition")) {
						outReverse = true;
						if(0 < $content.eq(i)[0].className.indexOf(name + "allend")) {
							animation[i].classNum  = animation[i].num-1;
							$content.eq(i).removeClass(name + "allend");
							$content.eq(i).removeClass(name + animation[i].num);
						}
					}
					else { 
						animation[i].classNum  = 1;
						$content.eq(i)[0].className = animation[i].className;
						eventListener.remove(i);
					}
				}
			});
		} else {
			$(this).addClass(name + animation[i].classNum);
			
			eventListener.add(i);
		}
	});


	/**
	 *	アニメーションが終わったら実行、状況に合わせてクラスの追加や削除を行う
	 *	@method ccssanime
	 *	@param {Object} モーションの配列
	 *	@param {Number} animation配列の何番目なのか
	 */
	function ccssanime(e,i) {
		$content = $(e.target);

		if(!(animation[i].propertyName)) {

			if(type == "transition") {
				animation[i].propertyName = e.propertyName;
				setTimeout(function() {
					animation[i].propertyName = 0;
				},0)
			};

			if(!(outReverse)) {animation[i].classNum++;} else {animation[i].classNum--;};

			//今のアニメーション番号が0以上 かる 最大アニメーション回数以下の時
			if ((animation[i].classNum > 0) && ( animation[i].classNum <= animation[i].num)) {
				if(outReverse) {
					$content.removeClass(name + (animation[i].classNum + 1));
				} else {
					$content.addClass(name + animation[i].classNum);
				}
	
				if(type == "animation") {
					/* delayがあった場合 */
					var animationDelay =  
					(!(userAgent.indexOf("webkit") == -1)) ? $content.css("-webkit-animation-delay") :
					(!(userAgent.indexOf("gecko") == -1)) ? $content.css("-moz-animation-delay") :
					(!(userAgent.indexOf("opera") == -1)) ? $content.css("-o-animation-delay") :
					(!(userAgent.indexOf("MSIE 10.0") == -1)) ? $content.css("-ms-animation-delay") : "";
					var delay = animationDelay.substring(0,animationDelay.length-1) * 1000;
					
					if(0 < delay) {
						$content.addClass("end" + (animation[i].classNum - 1));
						
						setTimeout(function() {
							$content.removeClass("end" + (animation[i].classNum - 1));
						},delay)
					}
				}

				if(animation[i].onCompArray[animation[i].classNum - 1]) {
					animation[i].onCompArray[animation[i].classNum - 1]();
				}
			} else {
				animation[i].classNum  = 1;
				//animeだったらクラスをもとに戻す
				if(type == "animation") {
					$content[0].className = animation[i].className;
				};
	
				if(!(outReverse)) {
					outReverse = false;
					$content.addClass(name + "allend");
				} else {
					outReverse = false;
					$content.removeClass(name + 1);
					
					eventListener.remove(i);
				};
			
				if(onComplate) {
					onComplate();
				};
			}
		}
	}
}

}(jQuery));
