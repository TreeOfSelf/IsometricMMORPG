
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




//Function to resize the canvas to fit the screen
resizeCanvas = function(){
	
	
	renderSettings.screenSize = [Math.round(window.innerWidth*0.95*(renderSettings.resolution)),Math.round(window.innerHeight*0.95*(renderSettings.resolution))];
	//renderSettings.screenSize=[800,400];
	canvas.width = renderSettings.screenSize[0];
	canvas.height = renderSettings.screenSize[1];
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
}




gl.useProgram(isometricProgram)
//Texture
var texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
var textureCoords = [
/*0.01,0,
0.01,0,
0.01,0,
0.01,0,

0.34,0,
0.34,0,
0.34,0,
0.34,0,
0.34,0,

0.68,0,
0.68,0,
0.68,0,
0.68,0,
0.68,0,

0.01,0,
0.01,0,
0.01,0,
0.01,0,
0.01,0,
0.01,0,*/
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
 

//Position
var positionBuffer = gl.createBuffer();
var cursorBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
var positions = [





];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


var isometricVAO = gl.createVertexArray();
gl.bindVertexArray(isometricVAO);

gl.bindBuffer(gl.ARRAY_BUFFER, cursorBuffer);
gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);





gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);


gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
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
	
	
	var viewMatrix = glMatrix.mat2.fromValues(
	27* renderSettings.blockRotation[0] 
	,13* renderSettings.blockRotation[2]  
	,27 * renderSettings.blockRotation[1]
	,13* renderSettings.blockRotation[3]
	);
	gl.uniformMatrix2fv(isometricShaderProgram.uniforms.pixelMatrix, false, viewMatrix);


	//26,12

	// Bind the attribute/buffer set we want.
	gl.bindVertexArray(isometricVAO);
	
	//Clear previous buffers then draw
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	 aspect = canvas.height/canvas.width;
	//gl.drawArrays(gl.POINTS, 0, positions.length/3);

	

	
	var cursorMatrix = glMatrix.mat2.create();
	var camVector = glMatrix.vec2.fromValues(playerControls.mousePosition[0]-(canvas.width/2),-playerControls.mousePosition[1]+(canvas.height/2));
	glMatrix.mat2.invert(cursorMatrix,viewMatrix);
	glMatrix.vec2.transformMat2(camVector,camVector,cursorMatrix);
	mapX = (camVector[0]);
	mapY = (camVector[1]);
	
	

	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);

		
	gl.drawArrays(gl.POINTS,0,positions.length/3);
	
	gl.bindBuffer(gl.ARRAY_BUFFER,cursorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
	[mapX,mapY,0]
	), gl.STATIC_DRAW);
	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cursorBuffer);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);

	
	gl.drawArrays(gl.POINTS, 0, 1);

	//Request next frame
	requestAnimationFrame(render);

}

render();
