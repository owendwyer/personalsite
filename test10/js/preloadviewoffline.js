opdPreloader=(function(){
	var canvas=document.getElementById('preCanvas');
	var containerDiv=document.getElementById('containerDiv');
	var winHei=window.innerHeight;
	var winWid=containerDiv.clientWidth;
	var orientation=winWid>winHei?0:1;
	var myTimer=null;
	canvas.width=orientation===0?800:550;
	canvas.height=orientation===0?550:800;
	var aspectRatio=orientation===0?800/550:550/800;
	var wid=0;
	var hei=0;

	var Y_MARGIN_DENOM_LAND=14;
	var Y_MARGIN_DENOM_PORT=20;
	var yMargin=orientation===0?Math.round(winHei/Y_MARGIN_DENOM_LAND):Math.round(winHei/Y_MARGIN_DENOM_PORT);

	if(winWid/winHei>aspectRatio){
		hei=winHei-yMargin;
		wid=hei*aspectRatio;
	}else{
		wid=winWid;
		hei=wid/aspectRatio;
		if(hei+20>winHei){
			wid=winWid-10;
			hei=wid/aspectRatio;
		}
		if (orientation === 0 && hei + yMargin > winHei) {
			hei = winHei - yMargin;
			wid = hei * aspectRatio;
		}
	}
	wid=Math.floor(wid);
	hei=Math.floor(hei);

	canvas.style.width=wid+'px';
	canvas.style.height=hei+'px';
	canvas.style.borderRadius='1.6em';
	containerDiv.style.height=hei+'px';

	var ctx=canvas.getContext('2d');
	ctx.font = "bold 20px Arial";
	ctx.fillStyle = "#444";
	ctx.textAlign = "center";
	ctx.fillText("Loading", canvas.width/2, canvas.height/2);
	ctx.fillStyle = "#67C0FF";
	ctx.strokeStyle = "#333";

	function browserNotSupported(){
		isBrowserSupported=false;
		clearTimeout(myTimer);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "#444";
		ctx.fillText("Browser not supported", canvas.width/2, canvas.height/2);
	}

	function checkArrowSupport() {
		try { 
			var opdArrowFun=()=>true;
		}
		catch (e) { return false; }
		return true;
	}

	if (!checkArrowSupport()) {
		browserNotSupported();
	}

	function roundedRect(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.arcTo(x, y + height, x + radius, y + height, radius);
		ctx.lineTo(x + width - radius, y + height);
		ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
		ctx.lineTo(x + width, y + radius);
		ctx.arcTo(x + width, y, x + width - radius, y, radius);
		ctx.lineTo(x + radius, y);
		ctx.arcTo(x, y, x, y + radius, radius);
		ctx.stroke();
		ctx.fill();
	}

	var staX=canvas.width/2-35*4+2;
	var count=0;
	var isBrowserSupported=true;

	function updateCanvas(){
		if(count===16){
			ctx.clearRect(staX-2, canvas.height/2+38, staX+count*35+4, 34);
			count=0;
		}
    		if(count<8)roundedRect(ctx, staX+count*35, canvas.height/2+40, 30, 30, 8);
		count++;
		myTimer=setTimeout(updateCanvas,100);
	}
	updateCanvas();

	var myIm=new Image();
	myIm.src='[#url]/ims/logo.3.3.png';
	myIm.onload=function(){
		if(isBrowserSupported){
			ctx.clearRect(canvas.width/2-140,canvas.height/2-155,280,170);
			ctx.drawImage(myIm,canvas.width/2-156,canvas.height/2-115);
		}
	}

	function clearAll(){
		clearTimeout(myTimer);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		canvas.style.display='none';
	}

	function loadFailed(){
		clearTimeout(myTimer);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "#444";
		ctx.fillText("Load Failed", canvas.width/2, canvas.height/2);
	}

	return {
		clearAll:clearAll,
		loadFailed:loadFailed,
		browserNotSupported:browserNotSupported
	};
})();