/*
 * jQuery continuous CssAnime
 *
 * jQuery required.
 *
 * Copyright 2011 (c) kamem
 * http://develo.org/
 * Licensed Under the MIT.
 *
 * Date: 2012.1.18
	type : "animation" || "transition"
	num : cssでアニメーションを繰り返す回数
	name : アニメーションするときに付けるclass名
	例 ) move1

	onComplate : 全てのアニメーションが終わったときに実行する関数

	途中のcssアニメーションの終了時に処理を実行したい場合
	例 ) 3回目の場合
	anime3onComplate
	
	btn : true || false
	btnContent : hoverしたときに反応させたいコンテンツ

*/
(function($){

$.fn.continuousCssAnime = function(options) {
	$content = this;
	var c = $.extend({
		type: "transition",
		num : 1,
		name : "move",
		onComplate:'',
		btn : false,
		btnContent : $content,
		animeReverse : false
	},options);


	var name = c.name,
	num = c.num,
	onComplate = c.onComplate,
	type = c.type,
	btn = c.btn,
	btnContent = c.btnContent;

	var userAgent = navigator.userAgent.toLowerCase();
	var animationend = 
	(!(userAgent.indexOf("webkit") == -1)) ? ((type == "transition") ? "webkitTransitionEnd" : "webkitAnimationEnd") : 
	(!(userAgent.indexOf("gecko") == -1)) ? ((type == "transition") ? "transitionend" : "animationend") :
	(!(userAgent.indexOf("opera") == -1)) ? ((type == "transition") ? "oTransitionEnd" : "oAnimationend") :
	(!(userAgent.indexOf("MSIE 10.0") == -1)) ? ((type == "transition") ? "MSTransitionEnd" : "MSAnimationend") : "";
	
	// ボタンをoutした時のReverseフラグ
	var outReverse = false;

	var animation = {};
		
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
		
		
		/* 何番目のアニメーション終わったときに関数を実行するか */
		animation[i].onCompArray = []
		for(var j = 1;j <= animation[i].num;j++) {
			if(c["anime" + j + "onComplate"]) {
				animation[i].onCompArray[j] = c["anime" + j + "onComplate"];
			}
		}

		/* btnがfaluse意外の時*/
		if(btn) {
			btnContent[btn](function () {
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
				if((type == "animation") && (btn == "hover")) {
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
		}
		else {
			$(this).addClass(name + animation[i].classNum);
			
			eventListener.add(i);
		}
	});


	function ccssanime(e,i) {
		$content = $(e.target);
		
		if(!(animation[i].propertyName)) {
			
			if(type == "transition") {
				animation[i].propertyName = e.propertyName;
				setTimeout(function() {
					animation[i].propertyName = 0;
				},0)
			}
			

			if(!(outReverse)) {animation[i].classNum++;}else {animation[i].classNum--;}
			if ((animation[i].classNum > 0) && ( animation[i].classNum <= animation[i].num)) {
				if(outReverse) {
					$content.removeClass(name + (animation[i].classNum + 1));
				}
				else {
				
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
			}
			else {
				animation[i].classNum  = 1;
				//animeだったらクラスをもとに戻す
				if(type == "animation") {
					$content[0].className = animation[i].className;
				}
	
				if(!(outReverse)) {
					outReverse = false;
					$content.addClass(name + "allend");
				}
				else {
					outReverse = false;
					$content.removeClass(name + 1);
					
					eventListener.remove(i);
				}
			
				if(onComplate) {
					onComplate();
				}
			}
		}
	}
}

}(jQuery));
