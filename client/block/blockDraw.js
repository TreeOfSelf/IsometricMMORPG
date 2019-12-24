onmessage = function(e) {
  var data = e.data;
  switch(data.id){
	  case "blockSettings":
		blockSettings = data.blockSettings;
	  break;

	  case "chunk_draw":
	  chunk = {};
	  chunk.blockArray = data.chunk;
	  chunk.coords = data.coords,
	  chunk_draw_block();
	  
	  self.postMessage({
		id : 'chunk_draw',
		chunkID : data.chunkID,
		draw : [chunk.position,chunk.textureCoords],
	  });
	  
	  break;
  }
}

//Chunk

//Returns chunkID from chunk XYZ
chunk_returnID = function(x,y,z){
	return(x+blockSettings.chunk.space*(y+blockSettings.chunk.space*z));
}

//Returns chunk XYZ from block space XYZ
chunk_get =function(x,y,z){
	return([Math.floor(x/blockSettings.chunk.XYZ),Math.floor(y/blockSettings.chunk.XYZ),Math.floor(z/blockSettings.chunk.XYZ)]);
}




//Block

function block_getID(i){
x = i % blockSettings.chunk.XYZ
y = Math.floor(( i / blockSettings.chunk.XYZ )) % blockSettings.chunk.XYZ
z = Math.floor(i / ( blockSettings.chunk.XYZ * blockSettings.chunk.XYZ ))
return([x,y,z]);
}


function block_check(x,y,z){

	var chunkPosition =	 chunk_get(x,y,z);
	if(chunkPosition[0] != chunk.coords[0] || chunkPosition[1] != chunk.coords[1] || chunkPosition[2] != chunk.coords[2]){
		return(0);
	}		
	var blockLocation = [(x) - (chunkPosition[0]*blockSettings.chunk.XYZ), (y) - (chunkPosition[1]*blockSettings.chunk.XYZ),(z) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;

	if(chunk.blockArray[blockIndex]!=0){
		return([x,y,z]);
	}
	
	return(0);
	
	
}

function block_check_surrounding(x,y,z){
	var blockAbove = block_check(x,y,z-1);
	var blockLeft =  block_check(x-1,y,z);
	var blockRight =  block_check(x+1,y,z);
	var blockUp = block_check(x,y-1,z);
	var blockDown = block_check(x,y+1,z);
	
	if(blockAbove != 0 && blockLeft != 0 && blockRight != 0 && blockUp != 0 && blockDown !=0){
		return(1);
	}else{
		return(0);
	}
}


function chunk_draw_block(){
	
	//Reset draw data
	chunk.position = [];
	chunk.textureCoords=[];

	//loop through chunk blocks
	for(var k=0;k<chunk.blockArray.length;k++){
		//if block exists
		if(chunk.blockArray[k]!=0){
			//get xyz position for drawing
			
			var blockPos = block_getID(k);
			blockPos=[blockPos[0]+chunk.coords[0]*blockSettings.chunk.XYZ,blockPos[1]+chunk.coords[1]*blockSettings.chunk.XYZ,blockPos[2]+chunk.coords[2]*blockSettings.chunk.XYZ];
			
			if(block_check_surrounding(blockPos[0],blockPos[1],blockPos[2])==0){
			
			
			var pos = block_getID(k);
			chunk.position.push(pos[0]+(chunk.coords[0]*blockSettings.chunk.XYZ),pos[1]+(chunk.coords[1]*blockSettings.chunk.XYZ),pos[2]+(chunk.coords[2]*blockSettings.chunk.XYZ));
			chunk.textureCoords=chunk.textureCoords.concat(block_get_texture(chunk.blockArray[k]));
		
			}
		}
	}
	
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
