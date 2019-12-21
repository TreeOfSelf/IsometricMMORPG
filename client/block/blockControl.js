var blockSettings = {
	chunk : {
		space : 64,
		XYZ : 32,
	},	
	sector : {
		space : 32,
		XYZ : 4,
	},
	//Determines how far out to process chunks
	processDistance : {
		XY : 4,
		Z : 4,
	},
}

//Sector

var activeSectors=[];
var sector=[];



sector_create = function(x,y,z){
	//Receive sector ID from XYZ
	var sectorID = sector_returnID(x,y,z);
	//If sector hasn't been created
	if(sector[sectorID]==null){
		activeSectors.push(sectorID);
		//Create new chunk
		sector[sectorID]={
			//reDraw flag
			reDraw : 1,
			//coordinates
			coords : [x,y,z],
			
		}
		
	}
}


//Returns sectorID from  sector XYZ
sector_returnID = function(x,y,z){
	return(x+blockSettings.sector.space*(y+blockSettings.sector.space*z));
}

//Returns sector XYZ from chunk XYZ
sector_get =function(x,y,z){
	return([Math.floor(x/blockSettings.sector.XYZ),Math.floor(y/blockSettings.sector.XYZ),Math.floor(z/blockSettings.sector.XYZ)]);
}


sector_create = function(x,y,z){
	//Receive sector ID from XYZ
	var sectorID = sector_returnID(x,y,z);
	//If sector hasn't been created
	if(sector[sectorID]==null){
		activeSectors.push(sectorID);
		//Create new chunk
		sector[sectorID]={
			//reDraw flag
			reDraw : 1,
			//coordinates
			coords : [x,y,z],
			
		}
		
	}
}



//Flags a chunk's sector to re draw (used for LOD changing or remeshing)
chunk_draw_sector=function(chunkID){
	var sectorPosition = sector_get(chunk[chunkID].coords[0],chunk[chunkID].coords[1],chunk[chunkID].coords[2]);
	//Draw the sector now that it has new information
	var sectorID=sector_returnID(sectorPosition[0],sectorPosition[1],sectorPosition[2]);
	if(sector[sectorID]==null){
		sector_create(sectorPosition[0],sectorPosition[1],sectorPosition[2]);
	}
	sector[sectorID].reDraw=1;
}




//Chunk

var activeChunks = [];
var chunk=[];

//Returns chunkID from chunk XYZ
chunk_returnID = function(x,y,z){
	return(x+blockSettings.chunk.space*(y+blockSettings.chunk.space*z));
}

//Returns chunk XYZ from block space XYZ
chunk_get =function(x,y,z){
	return([Math.floor(x/blockSettings.chunk.XYZ),Math.floor(y/blockSettings.chunk.XYZ),Math.floor(z/blockSettings.chunk.XYZ)]);
}



function chunk_create(x,y,z){
	
	var chunkID = chunk_returnID(x,y,z);
	activeChunks.push(chunkID);
	if(chunk[chunkID]==null){
		chunk[chunkID]={
			coords : [x,y,z],
			blockArray : new Uint8Array(Math.pow(blockSettings.chunk.XYZ,3)).fill(0),	
			sceneryArray  : [],
			flags : {
				reDrawBlock : 0,
				reDrawScenery : 0,
				processing : 0,
			},
			drawData : {
				block : {
					position : [],
					textureCoords : [],
				},
				scenery : {
					position : [],
					textureCoords : [],
				},
			},
			blockVAO : gl.createVertexArray(),
			sceneryVAO : gl.createVertexArray(),
			buffers : {
				block : {
					position : gl.createBuffer(),
					textureCoords : gl.createBuffer(),
				},
				scenery : {
					position : gl.createBuffer(),
					textureCoords : gl.createBuffer(),
				},
			},
		};
	}
	
}

function chunk_draw_scenery(chunkID){
	
	//Reset draw data
	chunk[chunkID].drawData.scenery.position = [];
	chunk[chunkID].drawData.scenery.textureCoords=[];


	
	//loop through chunk scenery
	for(var k=0;k<chunk[chunkID].sceneryArray.length;k++){
		//if block exists
		if(chunk[chunkID].sceneryArray[k]!=null && chunk[chunkID].sceneryArray[k].length!=0){
			//get xyz position for drawing
			var pos = block_getID(k);
			
			//loop through scenery in lock
			for(var l=0;l<chunk[chunkID].sceneryArray[k].length;l++){
			
				chunk[chunkID].drawData.scenery.position.push(chunk[chunkID].sceneryArray[k][l][0]+(chunk[chunkID].coords[0]*blockSettings.chunk.XYZ),chunk[chunkID].sceneryArray[k][l][1]+(chunk[chunkID].coords[1]*blockSettings.chunk.XYZ),chunk[chunkID].sceneryArray[k][l][2]+(chunk[chunkID].coords[2]*blockSettings.chunk.XYZ));
				chunk[chunkID].drawData.scenery.textureCoords=chunk[chunkID].drawData.scenery.textureCoords.concat(scenery_get_texture(chunk[chunkID].sceneryArray[k][l][3]));
				
			}
		}
		
	}
	
	
	gl.bindVertexArray(chunk[chunkID].sceneryVAO);

	
	gl.bindBuffer(gl.ARRAY_BUFFER, chunk[chunkID].buffers.scenery.position);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk[chunkID].drawData.scenery.position), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, chunk[chunkID].buffers.scenery.textureCoords);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.texture);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.texture, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk[chunkID].drawData.scenery.textureCoords), gl.STATIC_DRAW);
	
	
}


function chunk_draw_block(chunkID){
	
	//Reset draw data
	chunk[chunkID].drawData.block.position = [];
	chunk[chunkID].drawData.block.textureCoords=[];

	//loop through chunk blocks
	for(var k=0;k<chunk[chunkID].blockArray.length;k++){
		//if block exists
		if(chunk[chunkID].blockArray[k]!=0){
			//get xyz position for drawing
			var pos = block_getID(k);
			chunk[chunkID].drawData.block.position.push(pos[0]+(chunk[chunkID].coords[0]*blockSettings.chunk.XYZ),pos[1]+(chunk[chunkID].coords[1]*blockSettings.chunk.XYZ),pos[2]+(chunk[chunkID].coords[2]*blockSettings.chunk.XYZ));
			chunk[chunkID].drawData.block.textureCoords=chunk[chunkID].drawData.block.textureCoords.concat(block_get_texture(chunk[chunkID].blockArray[k]));
		}
	}
		
	
	gl.bindVertexArray(chunk[chunkID].blockVAO);


	gl.bindTexture(gl.TEXTURE_2D, blockTexture);
	gl.bindBuffer(gl.ARRAY_BUFFER, chunk[chunkID].buffers.block.position);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.position);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.position, 3, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk[chunkID].drawData.block.position), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, chunk[chunkID].buffers.block.textureCoords);
	gl.enableVertexAttribArray(isometricShaderProgram.attributes.texture);
	gl.vertexAttribPointer(isometricShaderProgram.attributes.texture, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk[chunkID].drawData.block.textureCoords), gl.STATIC_DRAW);
	
	
}

function chunk_procces(){
	for(var i=0;i<activeChunks.length;i++){
		
		if(chunk[chunkID].flags.reDraw==1){
			chunk_draw(activeChunks[i]);
			chunk[chunkID].flags.reDraw=0;
		}
		
	}
}

//Block


block_change = function(x,y,z,change){
	
	var chunkPosition = chunk_get(x,y,z);
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var blockLocation = [(x) - (chunkPosition[0]*blockSettings.chunk.XYZ), (y) - (chunkPosition[1]*blockSettings.chunk.XYZ),(z) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;

	if(chunk[chunkID]==null){
	chunk_create(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	}
	

	chunk[chunkID].blockArray[blockIndex]=change;	


	
	//Flag chunk to re-draw
	chunk[chunkID].flags.reDrawBlock=1;

}

function block_getID(i){
x = i % 32
y = Math.floor(( i / 32 )) % 32
z = Math.floor(i / ( 32 * 32 ))
return([x,y,z]);
}

function block_check(x,y,z){
	var chunkPosition = chunk_get(x,y,z);
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var blockLocation = [(x) - (chunkPosition[0]*blockSettings.chunk.XYZ), (y) - (chunkPosition[1]*blockSettings.chunk.XYZ),(z) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;

	if(chunk[chunkID]!=null){
		if(chunk[chunkID].blockArray[blockIndex]!=0){
			
			return([x,y,z]);
		}
	}
	return(0);
	
	
}

function block_ray_down(x,y,z){
	
	var hit=0;
	var checkLimit = 10;
	var zCheck = z+1;
	while(hit==0 && checkLimit>0){
		var blockHit  = block_check(x,y,zCheck);
			if(blockHit!=0){
				if(zCheck!=z+1){
				return(blockHit);
				}else{
				return(0);
				}
			}
		zCheck+=1;
		checkLimit--;
	}
	return(0);
	
}


function block_get_texture(textureID){
	switch(textureID){
		case 1:
			return([0.00,0]);
		break;
		case 2:
			return([0+58/342,0])
		break;
		case 3:
			return([0+115/342,0])
		break;
		case 4:
			return([0+172/342,0])
		break;
		case 5:
			return([0+229/342,0])
		break;
		case 6:
			return([0+286/342,0])
		break;
		case 7:
			return([0.0,0.51])
		break;
		case 8:
			return([0+58/342,0.51])
		break;
		case 9:
			return([0+115/342,0.51])
		break;
	}
}


//Scenery
scenery_change = function(x,y,z,change){
	
	var chunkPosition = chunk_get(Math.round(x),Math.round(y),Math.round(z));
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var blockLocation = [(Math.round(x)) - (chunkPosition[0]*blockSettings.chunk.XYZ), (Math.round(y)) - (chunkPosition[1]*blockSettings.chunk.XYZ),(Math.round(z)) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;


	if(chunk[chunkID]==null){
	chunk_create(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	}
	
	if(chunk[chunkID].sceneryArray[blockIndex]==null){
		chunk[chunkID].sceneryArray[blockIndex]=[];
	}
	

	chunk[chunkID].sceneryArray[blockIndex].push([x-(chunkPosition[0]*blockSettings.chunk.XYZ),y-(chunkPosition[1]*blockSettings.chunk.XYZ),z-(chunkPosition[2]*blockSettings.chunk.XYZ),change]);	

	
	//Flag chunk to re-draw
	chunk[chunkID].flags.reDrawScenery=1;

}

scenery_get_texture = function(textureID){
	switch(textureID){
		case 1:
			return([0.00,0]);
		break;
		case 2:
			return([58/228,0]);
		break;
		case 3:
			return([115/228,0]);
		break;
		case 4:
			return([172/228,0]);
		break;
	}
}
