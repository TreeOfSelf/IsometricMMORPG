
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
gl.bindTexture(gl.TEXTURE_2D, blockTexture);
gl.uniform1i(isometricShaderProgram.uniforms.sampler, 0);



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
	renderSettings.blockRotation[0]+(renderSettings.blockRotationTarget[0]-renderSettings.blockRotation[0])*0.05,
	renderSettings.blockRotation[1]+(renderSettings.blockRotationTarget[1]-renderSettings.blockRotation[1])*0.05,
	renderSettings.blockRotation[2]+(renderSettings.blockRotationTarget[2]-renderSettings.blockRotation[2])*0.05,
	renderSettings.blockRotation[3]+(renderSettings.blockRotationTarget[3]-renderSettings.blockRotation[3])*0.05];
	
	
	
	//Set uniforms
	gl.uniform2fv(isometricShaderProgram.uniforms.screenSize, renderSettings.screenSize);  // offset it to the right half the screen
	gl.uniform1f(isometricShaderProgram.uniforms.zoom, renderSettings.zoom);
	gl.uniform1f(isometricShaderProgram.uniforms.resolution, renderSettings.resolution);
	gl.uniform3fv(isometricShaderProgram.uniforms.camera, renderSettings.camera);
	gl.uniform4fv(isometricShaderProgram.uniforms.blockRotation, renderSettings.blockRotation);
	gl.uniform2fv(isometricShaderProgram.uniforms.textureResolution,[0.162,1.26*0.5]);
	gl.uniform1f(isometricShaderProgram.uniforms.pixelSize, 57.0);
	
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
	mapX = (camVector[0]+renderSettings.camera[0]);
	mapY = (camVector[1]+renderSettings.camera[1]);
	
	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cursorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
	[mapX,mapY,Math.round(-renderSettings.camera[2])]
	), gl.DYNAMIC_DRAW);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cursorTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
	block_get_texture(playerControls.blockType)
	), gl.DYNAMIC_DRAW);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.texture);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.texture, 2, gl.FLOAT, false, 0, 0);

	
	gl.drawArrays(gl.POINTS, 0, 1);

	
	for(var i=0;i<activeChunks.length;i++){
		var chunkID = activeChunks[i];
		if(chunk[chunkID].flags.reDraw==1){
			chunk[chunkID].flags.reDraw=0;
			chunk_draw(chunkID);
		}
		
		if(chunk[chunkID].drawData.block.position.length>0){
			gl.bindVertexArray(chunk[chunkID].blockVAO);	
			gl.drawArrays(gl.POINTS, 0, chunk[chunkID].drawData.block.position.length/3);
		}
	}


	//Request next frame
	requestAnimationFrame(render);

}

render();