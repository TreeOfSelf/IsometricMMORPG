
//Object containing control related variables
playerControls = {
	mouseClickPosition : [-1,-1],
	mousePosition : [-1,-1],
	keys : [],
	blockType : 1,
	// 0 == block 1 == scenery
	placing : 0,
}




var placing =0;
var deleting=0;



//Mouse camera move
window.addEventListener("mousedown", function(e){

	
	
	playerControls.mouseClickPosition = [playerControls.mousePosition[0],playerControls.mousePosition[1]];
	//canvas.requestPointerLock();
	if(e.button==0){
		if(playerControls.placing==0){
			placing=1;
		}else{
			message_send_tcp(['scenery_change',mapX,mapY,Math.round(-renderSettings.camera[2]-1),playerControls.blockType]);
			//scenery_change(mapX,mapY,Math.round(-renderSettings.camera[2]),playerControls.blockType)
		}
	}else{
		deleting=1;
	}
});

window.addEventListener("mouseup", function(e){
	playerControls.mouseClickPosition = [-1,-1];
	
	if(e.button==0){
	placing=0;
	}else{
	deleting=0;
	}
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
	
	
	if(e.key=='1'){
		playerControls.blockType=1;
	}
	if(e.key=='2'){
		playerControls.blockType=2;
	}
	if(e.key=='3'){
		playerControls.blockType=3;
	}	
	if(e.key=='4'){
		playerControls.blockType=4;
	}
	if(e.key=='5'){
		playerControls.blockType=5;
	}
	if(e.key=='6'){
		playerControls.blockType=6;
	}
	if(e.key=='7'){
		playerControls.blockType=7;
	}			
	
	if(e.key=='M' || e.key=='m'){
		if(playerControls.placing==0){
			playerControls.placing=1;
		}else{
			playerControls.placing=0;
		}
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
		
		if(playerControls.placing==0){
			message_send_tcp(['block_change',Math.round(mapX),Math.round(mapY),Math.round(-renderSettings.camera[2]),playerControls.blockType]);
			//block_change(Math.round(mapX),Math.round(mapY),Math.round(-renderSettings.camera[2]),playerControls.blockType);
		}
	}
	if(deleting==1){
		message_send_tcp(['block_change',Math.round(mapX),Math.round(mapY),Math.round(-renderSettings.camera[2]),0]);
	
	}
	
	if(playerControls.keys['O']==1){
		renderSettings.camera[2]+=0.1;
	}
	if(playerControls.keys['P']==1){
		renderSettings.camera[2]-=0.1;
	}
	
	if( (playerControls.mousePosition[0]/canvas.width > 0.8/renderSettings.resolution || playerControls.mousePosition[0]/canvas.width < 0.2*renderSettings.resolution || playerControls.mousePosition[1]/canvas.height > 0.8/renderSettings.resolution || playerControls.mousePosition[1]/canvas.height < 0.2*renderSettings.resolution) && placing==0 && deleting==0 ){	
	
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