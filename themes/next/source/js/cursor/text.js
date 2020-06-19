"use strict";
//定义点击出现文字类
(function(window,document,undefined) {

	var hearts = [];
	//自定义字体
	var fron = ['❤富强❤', '❤民主❤', '❤文明❤', '❤和谐❤', '❤自由❤', '❤平等❤', '❤公正❤' ,'❤法治❤', '❤爱国❤', '❤敬业❤', '❤诚信❤', '❤友善❤'];
	//初始化字体inde
	var finde = 0;
	window.requestAnimationFrame = (function(){
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback){
			setTimeout(callback, 1000/60);
		}
	})();
	init();
		
	//定义初始化
	function init() {
		css(".heart{width: 80px; height: 20px; position:fixed; transform: rotate(0deg); }");
		attachEvent();
		gameloop();
	}
	
	//
	function gameloop(){
		for(var i=0;i<hearts.length;i++){
			if(hearts[i].alpha <=0){
				document.body.removeChild(hearts[i].el);
				hearts.splice(i,1);
				continue;
			}
			hearts[i].y--;
			hearts[i].scale += 0.004;
			hearts[i].alpha -= 0.013;
			hearts[i].el.style.cssText = "left:"+hearts[i].x+"px;top:"+hearts[i].y+"px;opacity:"+hearts[i].alpha+";transform:scale("+hearts[i].scale+","+hearts[i].scale+") rotate(0deg); color:"+hearts[i].color;
		}
		requestAnimationFrame(gameloop);
	}

	//
	function attachEvent(){
		var old = typeof window.onclick==="function" && window.onclick
		//var old = window.onclick
		window.onclick = function(event){
			old && old();
			createFront(event);
		}
	}
	//创建文字 
	function createFront (event) {
		//向body中添加元素
		var d = document.createElement("div")
		d.className = "heart";
		//设置样式
		hearts.push({
			el : d,
			x : event.clientX - 5,
			y : event.clientY - 25,
			scale : 1,
			alpha : 1,
			color : randomColor()
		});
		document.body.appendChild(d);
		
		//随机字体字体下标增1
		finde = (finde+1) % fron.length;
		//添加样式
		//d.style.cssText = cssText + "-moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;"
		//d.style.color = randomColor();
		d.innerHTML = fron[finde];

	}

	// 
	function css(css){
		var style = document.createElement("style");
		style.type="text/css";
		try{
			style.appendChild(document.createTextNode(css));
		}catch(ex){
			style.styleSheet.cssText = css;
		}
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	//定义颜色
	function randomColor(){
		return "rgb("+(~~(Math.random()*255))+","+(~~(Math.random()*255))+","+(~~(Math.random()*255))+")"
	}	
	
})(window,document);


