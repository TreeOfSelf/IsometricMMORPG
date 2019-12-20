blockSettings = {
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




//Chunk

activeChunks = [];
chunk=[];

//Returns chunkID from chunk XYZ
chunk_returnID = function(x,y,z){
	return(x+blockSettings.chunk.space*(y+blockSettings.chunk.space*z));
}

//Returns chunk XYZ from block space XYZ
chunk_get =function(x,y,z){
	return([Math.floor(x/blockSettings.chunk.XYZ),Math.floor(y/blockSettings.chunk.XYZ),Math.floor(z/blockSettings.chunk.XYZ)]);
}



chunk_create = function(x,y,z){
	
	var chunkID = chunk_returnID(x,y,z);
	activeChunks.push(chunkID);
	if(chunk[chunkID]==null){
		chunk[chunkID]={
			coords : [x,y,z],
			blockArray : new Uint8Array(Math.pow(blockSettings.chunk.XYZ,3)).fill(0),	
			sceneryArray : [],
		};
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
	scenery_delete(x,y,z);
	scenery_delete(x,y,z+1);
	
	if(change==0){
		scenery_delete(x,y,z-1);
	}

}

block_getID = function(i){
x = i % 32
y = Math.floor(( i / 32 )) % 32
z = Math.floor(i / ( 32 * 32 ))
return([x,y,z]);
}

block_check = function(x,y,z){
	var chunkPosition = chunk_get(x,y,z);
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var blockLocation = [(x) - (chunkPosition[0]*blockSettings.chunk.XYZ), (y) - (chunkPosition[1]*blockSettings.chunk.XYZ),(z) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;

	if(chunk[chunkID]!=null){
		if(chunk[chunkID].blockArray[blockIndex]!=0){
			return([chunkID,x,y,z,blockIndex]);
		}
	}
	return(0);

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


}

scenery_check = function(x,y,z){
	var chunkPosition = chunk_get(x,y,z);
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var blockLocation = [(x) - (chunkPosition[0]*blockSettings.chunk.XYZ), (y) - (chunkPosition[1]*blockSettings.chunk.XYZ),(z) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;

	if(chunk[chunkID]!=null){
		if(chunk[chunkID].sceneryArray[blockIndex].length>0){
			return(1);
		}
	}
	return(0);
	
	
}

scenery_delete = function(x,y,z){
	var chunkPosition = chunk_get(x,y,z);
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var blockLocation = [(x) - (chunkPosition[0]*blockSettings.chunk.XYZ), (y) - (chunkPosition[1]*blockSettings.chunk.XYZ),(z) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;
	

	
	if(chunk[chunkID]!=null){
		if(chunk[chunkID].sceneryArray[blockIndex]!=null && chunk[chunkID].sceneryArray[blockIndex].length>0){
			
			chunk[chunkID].sceneryArray[blockIndex]=[];
			message_send_tcp_all(['scenery_delete',chunkID,blockIndex]);

		}
	}

	
}




