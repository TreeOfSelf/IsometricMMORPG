const fs = require('fs');

map_save = function(){
	var saveArray = [];
	
	for(var k=0; k<activeChunks.length;k++){
		var chunkID = activeChunks[k];
		saveArray.push(JSON.stringify([chunk[chunkID].coords,Array.prototype.slice.call(chunk[chunkID].blockArray),chunk[chunkID].sceneryArray]));
		
	}

	fs.writeFile('map', JSON.stringify(saveArray), (err) => {
		// throws an error, you could also catch it here
		if (err) throw err;

		// success case, the file was saved
		console.log('Map saved!');
	});

}

map_load = function(){
	fs.readFile('map', 'utf8', function(err, contents) {
		if(contents!=null){
			var mapArray = JSON.parse(contents);
			
			for(var k=0; k<mapArray.length; k++){
				var l = JSON.parse(mapArray[k]);
				chunk_create(l[0][0],l[0][1],l[0][2]);
				var chunkID = chunk_returnID(l[0][0],l[0][1],l[0][2]);
				chunk[chunkID].blockArray  = new Uint8Array( l[1] )
				chunk[chunkID].sceneryArray = l[2];
				

			}
			
		}
		
	});
}

map_load();