function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
				var mapArray = JSON.parse(allText);
				for(var k=0; k<mapArray.length; k++){
					var l = JSON.parse(mapArray[k]);
					chunk_create(l[0][0],l[0][1],l[0][2]);
					var chunkID = chunk_returnID(l[0][0],l[0][1],l[0][2]);
					chunk[chunkID].blockArray  = new Uint8Array( l[1] )
					chunk[chunkID].sceneryArray = l[2];
					chunk[chunkID].flags.reDrawScenery=1;
					chunk[chunkID].flags.reDrawBlock=1;
				}
            }
        }
    }
    rawFile.send(null);
}

//readTextFile('map');
