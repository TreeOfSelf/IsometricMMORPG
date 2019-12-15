
//Object containing control related variables
playerControls = {
	mouseClickPosition : [-1,-1],
	mousePosition : [-1,-1],
	keys : [],
	blockType : 0,
}




var placing =0;


//Mouse camera move
window.addEventListener("mousedown", function(e){
	
	playerControls.mouseClickPosition = [playerControls.mousePosition[0],playerControls.mousePosition[1]];
	//canvas.requestPointerLock();
	placing=1;
});

window.addEventListener("mouseup", function(e){
	playerControls.mouseClickPosition = [-1,-1];
	placing=0;
});

window.addEventListener("mousemove", function(e){
	
   var rect = canvas.getBoundingClientRect();
   playerControls.mousePosition[0] =  e.pageX - rect.left;
   playerControls.mousePosition[1] = e.pageY - rect.top;
	
	//playerControls.mousePosition[0] = e.clientX ;
	//playerControls.mousePosition[1] = e.clientY ;
});

window.addEventListener("keydown", function(e){
	
	//FullScreen
	if(e.key=='Enter'){
		canvas.requestFullscreen();
	}
	
	
	//Rotations (Sloppy)
	if(e.key=='q' || e.key=='Q'){
		renderSettings.blockRotationTarget=[-1,1,1,1];		
	}
	if(e.key=='w' || e.key=='W'){
		renderSettings.blockRotationTarget=[1,1,1,-1];
	}
	if(e.key=='e' || e.key=='E'){
		renderSettings.blockRotationTarget=[1,-1,-1,-1];
	}
	if(e.key=='r' || e.key=='R'){
		renderSettings.blockRotationTarget=[-1,-1,-1,1];
	}
	
	if(e.key=='a' || e.key=='A'){
		renderSettings.blockRotationTarget=[-1,1,-1,-1];		
	}
	if(e.key=='s' || e.key=='S'){
		renderSettings.blockRotationTarget=[1,1,-1,1];		
	}
	if(e.key=='d' || e.key=='D'){
		renderSettings.blockRotationTarget=[1,-1,1,1];	
	}
	if(e.key=='f' || e.key=='F'){
		renderSettings.blockRotationTarget=[-1,-1,1,-1];
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

//Ran every frame to process controls
function playerControlFunction(){
	//Move camera
	if(placing==1){
	 positions.push(Math.round(mapX),Math.round(mapY),0,);
	 textureCoords.push(0.01,0,);
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	}
	
	if(playerControls.mousePosition[0]/canvas.width > 0.8/renderSettings.resolution || playerControls.mousePosition[0]/canvas.width < 0.2*renderSettings.resolution || playerControls.mousePosition[1]/canvas.height > 0.8/renderSettings.resolution || playerControls.mousePosition[1]/canvas.height < 0.2*renderSettings.resolution  ){	
	
		var moveVector = glMatrix.vec2.fromValues(
		-((canvas.width/2) - playerControls.mousePosition[0]*renderSettings.resolution)*(0.04*Math.min(1,renderSettings.zoom))
		,((canvas.height/2) - playerControls.mousePosition[1]*renderSettings.resolution)*(0.04*Math.min(1,renderSettings.zoom))
		);
		glMatrix.vec2.transformMat2(moveVector,moveVector,cursorMatrix);
	
		//renderSettings.camera[0]-=(playerControls.mouseClickPosition[0] - playerControls.mousePosition[0])*(0.004/renderSettings.zoom);
		//renderSettings.camera[1]+=(playerControls.mouseClickPosition[1] - playerControls.mousePosition[1])*(0.004/renderSettings.zoom);
		renderSettings.camera[0]+=moveVector[0];
		renderSettings.camera[1]+=moveVector[1];
	}
	
}