
//Object containing control related variables
playerControls = {
	mouseClickPosition : [-1,-1],
	mousePosition : [-1,-1],
	keys : [],
}

//Mouse camera move
window.addEventListener("mousedown", function(e){
	playerControls.mouseClickPosition = [e.screenX,e.screenY];
});

window.addEventListener("mouseup", function(e){
	playerControls.mouseClickPosition = [-1,-1];
});

window.addEventListener("mousemove", function(e){
	playerControls.mousePosition[0] = e.screenX;
	playerControls.mousePosition[1] = e.screenY;
});

window.addEventListener("keydown", function(e){
	
	if(e.key=='Enter'){
		canvas.requestFullscreen();
	}
	
	
	playerControls.keys[e.key.toUpperCase()]=1;
});

window.addEventListener("keyup", function(e){
	playerControls.keys[e.key.toUpperCase()]=0;
});


//Scroll Zooming
window.addEventListener("wheel", function(e){
	if(e.deltaY>0 && renderSettings.zoom<=0.09){
		return(-1);
	}
	if(e.deltaY<0 && renderSettings.zoom>=16){
		return(-1);
	}
	
	renderSettings.zoom-=(e.deltaY/1000)*renderSettings.zoom;
	renderSettings.resolution=(1/renderSettings.zoom);
	if(renderSettings.resolution<0.9){
		renderSettings.resolution*=0.9;
	}

	if(renderSettings.resolution>1){
		renderSettings.resolution=1;
	}
	if(renderSettings.zoom<=0.09){
		renderSettings.zoom=0.09;
	}
	if(renderSettings.zoom>16){
		renderSettings.zoom=16;
	}
});

function playerControlFunction(){

	if(playerControls.mouseClickPosition[0]!=-1){
		
		renderSettings.camera[0]-=(playerControls.mouseClickPosition[0] - playerControls.mousePosition[0])*(0.04/renderSettings.zoom);
		renderSettings.camera[1]+=(playerControls.mouseClickPosition[1] - playerControls.mousePosition[1])*(0.04/renderSettings.zoom);
	}
	
}