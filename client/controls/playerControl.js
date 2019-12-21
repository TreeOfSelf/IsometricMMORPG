
//Object containing control related variables
playerControls = {
	mouseClickPosition : [-1,-1],
	mousePosition : [-1,-1],
	keys : [],
	blockType : 1,
	// 0 == block 1 == scenery
	placing : 0,
	position : [0,0,-1],
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
			
			if(block_check(mapX,mapY,mapZ)==0 && block_check(mapX,mapY,mapZ+1)!=0 && block_check(mapX,mapY,mapZ-1)==0 ){
				//message_send_tcp(['scenery_change',mapX,mapY,mapZ,playerControls.blockType]);
				scenery_change(mapX,mapY,mapZ,playerControls.blockType);
			}

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
	if(e.key=='I' || e.key=='i'){

		  var audioCtx = new AudioContext();
		  var url = './juicewrld.mp3';
		  var audio = new Audio(url);
		  var processor = audioCtx.createScriptProcessor(2048, 1, 1);
		  var meter = document.getElementById('meter');
		  var source;

		  audio.addEventListener('canplaythrough', function(){
			source = audioCtx.createMediaElementSource(audio);
			source.connect(processor);
			source.connect(audioCtx.destination);
			processor.connect(audioCtx.destination);
			audio.play();
		  }, false);

		  // loop through PCM data and calculate average
		  // volume for a given 2048 sample buffer
		  processor.onaudioprocess = function(evt){
			var input = evt.inputBuffer.getChannelData(0)
			  , len = input.length   
			  , total = i = 0
			  , rms;
			while ( i < len ) total += Math.abs( input[i++] );
			rms = Math.sqrt( total / len );
			audioLevel+=Math.pow(( rms * 100 ),2)*0.0001;
			
		  };



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
	if(e.key=='8'){
		playerControls.blockType=8;
	}	
	if(e.key=='9'){
		playerControls.blockType=9;
	}		
	
	if(e.key=='G' || e.key=='g'){
		if(playerControls.placing==0){
			playerControls.placing=1;
		}else{
			playerControls.placing=0;
		}
	}
	
	if(e.key=='l' || e.key=='L'){
		if(gravity==1){
			gravity=0;
		}else{
			gravity=1;
		}
	}
	
	//Rotations (Sloppy)
	if(e.key=='z' || e.key=='Z'){
		renderSettings.blockRotationTarget=[-1,1,1,1];		
	}
	if(e.key=='x' || e.key=='X'){
		renderSettings.blockRotationTarget=[1,1,1,-1];
	}
	if(e.key=='c' || e.key=='C'){
		renderSettings.blockRotationTarget=[1,-1,-1,-1];
	}
	if(e.key=='v' || e.key=='V'){
		renderSettings.blockRotationTarget=[-1,-1,-1,1];
	}
	
	if(e.key=='b' || e.key=='B'){
		renderSettings.blockRotationTarget=[-1,1,-1,-1];		
	}
	if(e.key=='n' || e.key=='N'){
		renderSettings.blockRotationTarget=[1,1,-1,1];		
	}
	if(e.key=='m' || e.key=='M'){
		renderSettings.blockRotationTarget=[1,-1,1,1];	
	}
	if(e.key==',' || e.key=='<'){
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
gravity=0;
momentum=0;
solid=0;
movementSpeed=3.5;
movementSpeedCheck=15.0;
//Ran every frame to process controls
function playerControlFunction(){

	solid=0;
	momentum*=0.9;
	if(gravity==1){
		var gravityBlock = block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]))
		if(  gravityBlock!=0 && Math.round(playerControls.position[2]-1)<gravityBlock[2] && block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))==0){
			playerControls.position[2]-=0.1;
			solid=1;
			momentum=0;

		}else{
			
		var gravityBlock = block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]+1))
		if(gravityBlock!=0 &&  block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]))==0){
			playerControls.position[2]=gravityBlock[2]-1;
			solid=1;
			momentum=0;
		}
		}
	if(solid==0){	
	
		var hitBlock = block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-0.9+momentum+0.2))
		if(hitBlock==0){
			playerControls.position[2]+= momentum+0.2;
			momentum+=0.0001;
		}else{
			momentum=0;
		}
	}
		
	}

	
	if(playerControls.position[2]>15){
		playerControls.position=[0,0,0]
	}
	
	if(playerControls.keys[' ']==1){
		if(solid==1 &&  block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-3.0))==0){
			
			solid=0;
			momentum=-0.6;
			playerControls.position[2]-=0.7;
		}
	}
	//Move player
	if(playerControls.keys['W']==1){
		
		var forwardVector = glMatrix.vec2.fromValues(0.0,0.5);
		glMatrix.vec2.transformMat2(forwardVector,forwardVector,cursorMatrix);
		
		var blockInfront = block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeedCheck),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		blockInfront+=block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeed),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		if(blockInfront==0){
			playerControls.position[0]+=forwardVector[0]*movementSpeed			
		}
		var blockInfront = block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeedCheck),Math.round(playerControls.position[2]-1))
		blockInfront += block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeed),Math.round(playerControls.position[2]-1))
		
		if(blockInfront==0){
			playerControls.position[1]+=forwardVector[1]*movementSpeed			
		}			
		
	}
	
	if(playerControls.keys['S']==1){
		
		var forwardVector = glMatrix.vec2.fromValues(0.0,-0.5);
		glMatrix.vec2.transformMat2(forwardVector,forwardVector,cursorMatrix);

		var blockInfront = block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeedCheck),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		blockInfront+=block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeed),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		if(blockInfront==0){
			playerControls.position[0]+=forwardVector[0]*movementSpeed			
		}
		var blockInfront = block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeedCheck),Math.round(playerControls.position[2]-1))
		blockInfront += block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeed),Math.round(playerControls.position[2]-1))
		
		if(blockInfront==0){
			playerControls.position[1]+=forwardVector[1]*movementSpeed			
		}
	}
	
	if(playerControls.keys['D']==1){
		
		var forwardVector = glMatrix.vec2.fromValues(0.5,0.0);
		glMatrix.vec2.transformMat2(forwardVector,forwardVector,cursorMatrix);

		var blockInfront = block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeedCheck),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		blockInfront+=block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeed),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		if(blockInfront==0){
			playerControls.position[0]+=forwardVector[0]*movementSpeed			
		}
		var blockInfront = block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeedCheck),Math.round(playerControls.position[2]-1))
		blockInfront += block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeed),Math.round(playerControls.position[2]-1))
		
		if(blockInfront==0){
			playerControls.position[1]+=forwardVector[1]*movementSpeed			
		}	
	}
	
	
	if(playerControls.keys['A']==1){
		
		var forwardVector = glMatrix.vec2.fromValues(-0.5,0.0);
		glMatrix.vec2.transformMat2(forwardVector,forwardVector,cursorMatrix);

		var blockInfront = block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeedCheck),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		blockInfront+=block_check(Math.round(playerControls.position[0]+forwardVector[0]*movementSpeed),Math.round(playerControls.position[1]),Math.round(playerControls.position[2]-1))
		if(blockInfront==0){
			playerControls.position[0]+=forwardVector[0]*movementSpeed			
		}
		var blockInfront = block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeedCheck),Math.round(playerControls.position[2]-1))
		blockInfront += block_check(Math.round(playerControls.position[0]),Math.round(playerControls.position[1]+forwardVector[1]*movementSpeed),Math.round(playerControls.position[2]-1))
		
		if(blockInfront==0){
			playerControls.position[1]+=forwardVector[1]*movementSpeed			
		}
	}
	
	
	//Move camera
	if(placing==1){
		
		if(playerControls.placing==0){
			message_send_tcp(['block_change',Math.round(mapX),Math.round(mapY),Math.round(mapZ),playerControls.blockType]);
			block_change(Math.round(mapX),Math.round(mapY),Math.round(mapZ),playerControls.blockType);
		}
	}
	if(deleting==1){
		
		message_send_tcp(['block_change',Math.round(mapX),Math.round(mapY),Math.round(mapZ),0]);
		block_change(Math.round(mapX),Math.round(mapY),Math.round(mapZ),0);
	}
	
	if(playerControls.keys['O']==1){
		playerControls.position[2]-=0.1;
	}
	if(playerControls.keys['P']==1){
		playerControls.position[2]+=0.1;
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