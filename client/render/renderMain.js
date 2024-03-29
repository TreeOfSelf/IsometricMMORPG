
//Object containing all the settings related to rendering

renderSettings = {
	screenSize : [0,0],
	screenSizePrevious : [0,0],
	resolution : 1,
	resolutionPrevious : 1,
	blockRotation : [-1,1,1,1],
	blockRotationTarget : [-1,1,1,1],
	zoom : 1,
	camera : [0,0,0],
	textureResolution :[0,0],
	viewUp : 12,
}


viewMatrix = glMatrix.mat2.fromValues(
27* renderSettings.blockRotation[0] 
,13* renderSettings.blockRotation[2]  
,27 * renderSettings.blockRotation[1]
,13* renderSettings.blockRotation[3]
);
cursorMatrix = glMatrix.mat2.create();
glMatrix.mat2.invert(cursorMatrix,viewMatrix);


//Function to resize the canvas to fit the screen
resizeCanvas = function(){
	
	
	renderSettings.screenSize = [Math.round(window.innerWidth*(renderSettings.resolution)),Math.round(window.innerHeight*(renderSettings.resolution))];
	//renderSettings.screenSize=[800,400];
	canvas.width = renderSettings.screenSize[0];
	canvas.height = renderSettings.screenSize[1];
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
}




gl.useProgram(isometricProgram)

var cursorTextureBuffer = gl.createBuffer();
var cursorBuffer = gl.createBuffer();

var isometricVAO = gl.createVertexArray();
gl.bindVertexArray(isometricVAO);

gl.bindBuffer(gl.ARRAY_BUFFER, cursorBuffer);
gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, cursorTextureBuffer);
gl.enableVertexAttribArray(isometricShaderProgram.attributes.texture);
gl.vertexAttribPointer(isometricShaderProgram.attributes.texture, 2, gl.FLOAT, false, 0, 0);


gl.activeTexture(gl.TEXTURE0);
gl.uniform1i(isometricShaderProgram.uniforms.sampler, 0);

audioLevel=0;

function render() {
	
	
	playerControlFunction();
	
	//Resize the canvas if the window or resolution has changed
	if(renderSettings.screenSizePrevious[0]!=window.innerWidth || 
	renderSettings.screenSizePrevious[1]!=window.innerHeight ||
	renderSettings.resolutionPrevious != renderSettings.resolution){
		renderSettings.resolutionPrevious = renderSettings.resolution;
		renderSettings.screenSizePrevious=[window.innerWidth,window.innerHeight];
		resizeCanvas();
	}

	//Rotate blocks to target
	renderSettings.blockRotation=[
	renderSettings.blockRotation[0]+(renderSettings.blockRotationTarget[0]-renderSettings.blockRotation[0])*0.01,
	renderSettings.blockRotation[1]+(renderSettings.blockRotationTarget[1]-renderSettings.blockRotation[1])*0.01,
	renderSettings.blockRotation[2]+(renderSettings.blockRotationTarget[2]-renderSettings.blockRotation[2])*0.01,
	renderSettings.blockRotation[3]+(renderSettings.blockRotationTarget[3]-renderSettings.blockRotation[3])*0.01];
	
	
	
	//Set uniforms
	gl.uniform2fv(isometricShaderProgram.uniforms.screenSize, renderSettings.screenSize);  // offset it to the right half the screen
	gl.uniform1f(isometricShaderProgram.uniforms.zoom, renderSettings.zoom);
	gl.uniform1f(isometricShaderProgram.uniforms.resolution, renderSettings.resolution);
	gl.uniform1f(isometricShaderProgram.uniforms.soundWave, Math.sin(audioLevel)*10.0);
	gl.uniform3fv(isometricShaderProgram.uniforms.camera, [playerControls.position[0],playerControls.position[1],-playerControls.position[2]]);
	gl.uniform1f(isometricShaderProgram.uniforms.viewUp, renderSettings.viewUp);
	
	gl.uniform4fv(isometricShaderProgram.uniforms.blockRotation, renderSettings.blockRotation);
	if(playerControls.placing==0){
		gl.uniform1f(isometricShaderProgram.uniforms.alphaLimit,1.0),
		gl.uniform1f(isometricShaderProgram.uniforms.notSquare,1);
		gl.uniform2fv(isometricShaderProgram.uniforms.textureResolution,[0.162,1.26*0.5]);
		gl.uniform1f(isometricShaderProgram.uniforms.pixelSize, 57.0);
		gl.uniform1f(isometricShaderProgram.uniforms.pixelOffset, 0.0);
		gl.uniform1f(isometricShaderProgram.uniforms.pixelDepthOffset, -0.0);
		gl.uniform1f(isometricShaderProgram.uniforms.step, 1.0);
		gl.bindTexture(gl.TEXTURE_2D, blockTexture);
	}else{
		gl.uniform1f(isometricShaderProgram.uniforms.alphaLimit,0.5),
		gl.uniform1f(isometricShaderProgram.uniforms.notSquare,0);
		gl.uniform2fv(isometricShaderProgram.uniforms.textureResolution,[0.163,0.5]);
		gl.uniform1f(isometricShaderProgram.uniforms.pixelSize, 57.0);		
		gl.uniform1f(isometricShaderProgram.uniforms.pixelOffset, -1.0);
		gl.uniform1f(isometricShaderProgram.uniforms.pixelDepthOffset, -1.1);
		gl.uniform1f(isometricShaderProgram.uniforms.step, 0.0)
		gl.bindTexture(gl.TEXTURE_2D, sceneryTexture);
	}
	
	viewMatrix = glMatrix.mat2.fromValues(
	27* renderSettings.blockRotation[0]*renderSettings.zoom*renderSettings.resolution 
	,13* renderSettings.blockRotation[2] *renderSettings.zoom*renderSettings.resolution  
	,27 * renderSettings.blockRotation[1]*renderSettings.zoom*renderSettings.resolution
	,13* renderSettings.blockRotation[3]*renderSettings.zoom*renderSettings.resolution
	);
	gl.uniformMatrix2fv(isometricShaderProgram.uniforms.pixelMatrix, false, viewMatrix);


	gl.bindVertexArray(isometricVAO);
	
	//Clear previous buffers then draw
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	

	var camVector = glMatrix.vec2.fromValues(playerControls.mousePosition[0]*renderSettings.resolution-(canvas.width/2),-playerControls.mousePosition[1]*renderSettings.resolution+(canvas.height/2));

	
	cursorMatrix = glMatrix.mat2.create();
	glMatrix.mat2.invert(cursorMatrix,viewMatrix);
	glMatrix.vec2.transformMat2(camVector,camVector,cursorMatrix);
	mapX = (camVector[0]+playerControls.position[0]);
	mapY = (camVector[1]+playerControls.position[1]);
	mapX=Math.round(mapX);
	mapY=Math.round(mapY);
	if(playerControls.placing==1){
		mapZ=Math.round(playerControls.position[2]);
	}else{
		mapZ=Math.round(playerControls.position[2]+1)
	}
	
	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cursorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
	[mapX,mapY,mapZ]
	), gl.DYNAMIC_DRAW);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cursorTextureBuffer);
	
	if(playerControls.placing==0){
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(block_get_texture(playerControls.blockType)), gl.DYNAMIC_DRAW);
	}else{
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scenery_get_texture(playerControls.blockType)), gl.DYNAMIC_DRAW);		
	}
	
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.texture);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.texture, 2, gl.FLOAT, false, 0, 0);

	
	if(playerControls.placing==0){
	gl.drawArrays(gl.POINTS, 0, 1);
	}else{
		if(block_check(mapX,mapY,mapZ)==0 && block_check(mapX,mapY,mapZ+1)!=0 && block_check(mapX,mapY,mapZ-1)==0 ){
			gl.drawArrays(gl.POINTS,0,1);
		}
	}
	var chunkList = [];
	
	for(var xx=-20;xx<=20;xx++){
	for(var yy=-20;yy<=20;yy++){	
	for(var zz=-10;zz<=10;zz++){
		var chunkPos = chunk_get(playerControls.position[0]+xx*blockSettings.chunk.XYZ,playerControls.position[1]+yy*blockSettings.chunk.XYZ,playerControls.position[2]+zz*blockSettings.chunk.XYZ);
		var chunkID = chunk_returnID(chunkPos[0],chunkPos[1],chunkPos[2]);
		if(chunk[chunkID]!=null){
			chunkList.push(chunkID);
		}
	}
	}
	}
		
	for(var i=0;i<chunkList.length;i++){
		var chunkID = chunkList[i];
		if(chunk[chunkID].flags.reDrawBlock==1){
			chunk[chunkID].flags.reDrawBlock=0;
			chunk_draw_block(chunkID);
		}
		if(chunk[chunkID].flags.reDrawScenery==1){
			chunk[chunkID].flags.reDrawScenery=0;
			chunk_draw_scenery(chunkID);
		}
		
		if(chunk[chunkID].drawData.block.position.length>0){
			gl.bindVertexArray(chunk[chunkID].blockVAO);	
			gl.bindTexture(gl.TEXTURE_2D, blockTexture);
			gl.uniform1f(isometricShaderProgram.uniforms.notSquare,1);
			gl.uniform2fv(isometricShaderProgram.uniforms.textureResolution,[0.163,1.26*0.5]);
			gl.uniform1f(isometricShaderProgram.uniforms.pixelSize, 57.0);
			gl.uniform1f(isometricShaderProgram.uniforms.pixelOffset, 0.0);
			gl.uniform1f(isometricShaderProgram.uniforms.pixelDepthOffset, -0.0);
			gl.uniform1f(isometricShaderProgram.uniforms.alphaLimit,1.0),
			gl.uniform1f(isometricShaderProgram.uniforms.step, 1.0)
			gl.drawArrays(gl.POINTS, 0, chunk[chunkID].drawData.block.position.length/3);
		}
	
		if(chunk[chunkID].drawData.scenery.position.length>0){
			gl.bindVertexArray(chunk[chunkID].sceneryVAO);	
			gl.bindTexture(gl.TEXTURE_2D, sceneryTexture);
			gl.uniform1f(isometricShaderProgram.uniforms.notSquare,0);
			gl.uniform2fv(isometricShaderProgram.uniforms.textureResolution,[0.166,0.5]);
			gl.uniform1f(isometricShaderProgram.uniforms.pixelSize, 57.0);
			gl.uniform1f(isometricShaderProgram.uniforms.pixelDepthOffset, -1.3);
			gl.uniform1f(isometricShaderProgram.uniforms.pixelOffset, -1.0);
			gl.uniform1f(isometricShaderProgram.uniforms.alphaLimit,0.7),
			gl.uniform1f(isometricShaderProgram.uniforms.step, 0.0)
			gl.drawArrays(gl.POINTS, 0, chunk[chunkID].drawData.scenery.position.length/3);
		}
		
	}
	
	
	var positionArray=[];
	var textureArray=[];
	
	for(var k=0; k<activeEntity.length ; k++){
		var entityID = activeEntity[k];

		entity[entityID].drawPosition[0]+=(entity[entityID].position[0]-entity[entityID].drawPosition[0])*0.1;
		entity[entityID].drawPosition[1]+=(entity[entityID].position[1]-entity[entityID].drawPosition[1])*0.1;	
		entity[entityID].drawPosition[2]+=(entity[entityID].position[2]-entity[entityID].drawPosition[2])*0.1;		

		var blockShadow = block_ray_down(Math.round(entity[entityID].drawPosition[0]),Math.round(entity[entityID].drawPosition[1]),Math.round(entity[entityID].drawPosition[2]));
		
		//Shadow hit
		if(blockShadow!=0){
				
				positionArray.push(
				entity[entityID].drawPosition[0],entity[entityID].drawPosition[1],entity[entityID].drawPosition[2]-0.22,
				entity[entityID].drawPosition[0],entity[entityID].drawPosition[1],blockShadow[2]-1-0.25
				)
				
				textureArray=textureArray.concat(entity_get_texture(entityID));
				
				textureArray.push(
				36/140,0,
				)
			}else{
				positionArray.push(
				entity[entityID].drawPosition[0],entity[entityID].drawPosition[1],entity[entityID].drawPosition[2]-0.22,
				)
				textureArray=textureArray.concat(entity_get_texture(entityID));	
			}
	}
	

	
	gl.bindVertexArray(isometricVAO);
	gl.bindBuffer(gl.ARRAY_BUFFER, cursorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray), gl.DYNAMIC_DRAW);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cursorTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.DYNAMIC_DRAW);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.texture);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.texture, 2, gl.FLOAT, false, 0, 0);
	

	gl.bindTexture(gl.TEXTURE_2D, entityTexture);
	gl.uniform1f(isometricShaderProgram.uniforms.notSquare,0);
	gl.uniform2fv(isometricShaderProgram.uniforms.textureResolution,[0.25,1]);
	gl.uniform1f(isometricShaderProgram.uniforms.pixelSize, 35.0);
	gl.uniform1f(isometricShaderProgram.uniforms.pixelOffset, -0.9);
	gl.uniform1f(isometricShaderProgram.uniforms.pixelDepthOffset, -1.0);
	gl.uniform1f(isometricShaderProgram.uniforms.alphaLimit,0.7),
	gl.uniform1f(isometricShaderProgram.uniforms.step, 0.0)
	gl.drawArrays(gl.POINTS, 0, positionArray.length/3 );
	
	//Request next frame
	requestAnimationFrame(render);

}

render();
