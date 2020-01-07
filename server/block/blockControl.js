var module=global.noise={};function Grad(r,e,d){this.x=r,this.y=e,this.z=d}Grad.prototype.dot2=function(r,e){return this.x*r+this.y*e},Grad.prototype.dot3=function(r,e,d){return this.x*r+this.y*e+this.z*d};var grad3=[new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)],p=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],perm=new Array(512),gradP=new Array(512);module.seed=function(r){r>0&&r<1&&(r*=65536),(r=Math.floor(r))<256&&(r|=r<<8);for(var e=0;e<256;e++){var d;d=1&e?p[e]^255&r:p[e]^r>>8&255,perm[e]=perm[e+256]=d,gradP[e]=gradP[e+256]=grad3[d%12]}},module.seed(0);var F2=.5*(Math.sqrt(3)-1),G2=(3-Math.sqrt(3))/6,F3=1/3,G3=1/6;function fade(r){return r*r*r*(r*(6*r-15)+10)}function lerp(r,e,d){return(1-d)*r+d*e}module.simplex2=function(r,e){var d,a,o=(r+e)*F2,t=Math.floor(r+o),p=Math.floor(e+o),n=(t+p)*G2,m=r-t+n,l=e-p+n;m>l?(d=1,a=0):(d=0,a=1);var G=m-d+G2,f=l-a+G2,g=m-1+2*G2,u=l-1+2*G2,i=gradP[(t&=255)+perm[p&=255]],P=gradP[t+d+perm[p+a]],h=gradP[t+1+perm[p+1]],s=.5-m*m-l*l,w=.5-G*G-f*f,v=.5-g*g-u*u;return 70*((s<0?0:(s*=s)*s*i.dot2(m,l))+(w<0?0:(w*=w)*w*P.dot2(G,f))+(v<0?0:(v*=v)*v*h.dot2(g,u)))},module.simplex3=function(r,e,d){var a,o,t,p,n,m,l=(r+e+d)*F3,G=Math.floor(r+l),f=Math.floor(e+l),g=Math.floor(d+l),u=(G+f+g)*G3,i=r-G+u,P=e-f+u,h=d-g+u;i>=P?P>=h?(a=1,o=0,t=0,p=1,n=1,m=0):i>=h?(a=1,o=0,t=0,p=1,n=0,m=1):(a=0,o=0,t=1,p=1,n=0,m=1):P<h?(a=0,o=0,t=1,p=0,n=1,m=1):i<h?(a=0,o=1,t=0,p=0,n=1,m=1):(a=0,o=1,t=0,p=1,n=1,m=0);var s=i-a+G3,w=P-o+G3,v=h-t+G3,M=i-p+2*G3,c=P-n+2*G3,y=h-m+2*G3,x=i-1+3*G3,F=P-1+3*G3,q=h-1+3*G3,z=gradP[(G&=255)+perm[(f&=255)+perm[g&=255]]],A=gradP[G+a+perm[f+o+perm[g+t]]],b=gradP[G+p+perm[f+n+perm[g+m]]],j=gradP[G+1+perm[f+1+perm[g+1]]],k=.6-i*i-P*P-h*h,B=.6-s*s-w*w-v*v,C=.6-M*M-c*c-y*y,D=.6-x*x-F*F-q*q;return 32*((k<0?0:(k*=k)*k*z.dot3(i,P,h))+(B<0?0:(B*=B)*B*A.dot3(s,w,v))+(C<0?0:(C*=C)*C*b.dot3(M,c,y))+(D<0?0:(D*=D)*D*j.dot3(x,F,q)))},module.perlin2=function(r,e){var d=Math.floor(r),a=Math.floor(e);r-=d,e-=a;var o=gradP[(d&=255)+perm[a&=255]].dot2(r,e),t=gradP[d+perm[a+1]].dot2(r,e-1),p=gradP[d+1+perm[a]].dot2(r-1,e),n=gradP[d+1+perm[a+1]].dot2(r-1,e-1),m=fade(r);return lerp(lerp(o,p,m),lerp(t,n,m),fade(e))},module.perlin3=function(r,e,d){var a=Math.floor(r),o=Math.floor(e),t=Math.floor(d);r-=a,e-=o,d-=t;var p=gradP[(a&=255)+perm[(o&=255)+perm[t&=255]]].dot3(r,e,d),n=gradP[a+perm[o+perm[t+1]]].dot3(r,e,d-1),m=gradP[a+perm[o+1+perm[t]]].dot3(r,e-1,d),l=gradP[a+perm[o+1+perm[t+1]]].dot3(r,e-1,d-1),G=gradP[a+1+perm[o+perm[t]]].dot3(r-1,e,d),f=gradP[a+1+perm[o+perm[t+1]]].dot3(r-1,e,d-1),g=gradP[a+1+perm[o+1+perm[t]]].dot3(r-1,e-1,d),u=gradP[a+1+perm[o+1+perm[t+1]]].dot3(r-1,e-1,d-1),i=fade(r),P=fade(e),h=fade(d);return lerp(lerp(lerp(p,G,i),lerp(n,f,i),h),lerp(lerp(m,g,i),lerp(l,u,i),h),P)};

blockSettings = {
	chunk : {
		space : 1024,
		XYZ : 16,
	},	
	sector : {
		space : 32,
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
			nodes : [],
		};
	
	

	}
	
	
	
}

chunk_resetNodes = function(id){
	chunk[id].nodes=[];
	for(var xx=0 ;xx<blockSettings.chunk.XYZ; xx++){
	for(var yy=0 ;yy<blockSettings.chunk.XYZ; yy++){
	for(var zz=0 ;zz<blockSettings.chunk.XYZ; zz++){
		var blockIndex = xx+yy*blockSettings.chunk.XYZ+zz*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;
		var coords = [xx+chunk[id].coords[0]*blockSettings.chunk.XYZ,yy+chunk[id].coords[1]*blockSettings.chunk.XYZ,zz+chunk[id].coords[2]*blockSettings.chunk.XYZ];
		chunk[id].nodes[blockIndex]=new PF.Node(coords[0],coords[1],coords[2]);
		
	}
	}
	}
	
	
}

chunk_pathfind = function(id){

	
	for(var xx=0 ;xx<blockSettings.chunk.XYZ; xx++){
	for(var yy=0 ;yy<blockSettings.chunk.XYZ; yy++){
	for(var zz=0 ;zz<blockSettings.chunk.XYZ; zz++){
		var blockIndex = xx+yy*blockSettings.chunk.XYZ+zz*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;
		var coords = [xx+chunk[id].coords[0]*blockSettings.chunk.XYZ,yy+chunk[id].coords[1]*blockSettings.chunk.XYZ,zz+chunk[id].coords[2]*blockSettings.chunk.XYZ];
		if(block_check(coords[0],coords[1],coords[2]-1)==0 && block_check(coords[0],coords[1],coords[2]-2)==0){
			chunk[id].nodes[blockIndex].neighbors=[];
			for(var xxx=-1;xxx<=1;xxx++){
			for(var yyy=-1;yyy<=1;yyy++){
			for(var zzz=-1;zzz<=1;zzz++){
				if(xxx != 0 || yyy != 0 || zzz!= 0){
					if(block_check(coords[0]+xxx,coords[1]+yyy,coords[2]+zzz)!=0 && block_check(coords[0]+xxx,coords[1]+yyy,coords[2]+zzz-1)==0 && block_check(coords[0]+xxx,coords[1]+yyy,coords[2]+zzz-1)==0){
						var node = block_get_node(xxx+coords[0],yyy+coords[1],zzz+coords[2]);
						if(node!=null){
							chunk[id].nodes[blockIndex].neighbors.push(node);
						}
					}
				}
			}
			}
			}
			
		}
			
		
	}
	}
	}
}


//Block






chunk_generate = function(x,y,z){

var chunkID = chunk_returnID(x,y,z);
if(chunk[chunkID]==null){
	chunk_create(x,y,z);
}

for(var xx=0 ;xx<blockSettings.chunk.XYZ; xx++){
for(var yy=0 ;yy<blockSettings.chunk.XYZ; yy++){
for(var zz=0 ;zz<blockSettings.chunk.XYZ; zz++){
	
	var heightLimit  = Math.abs(noise.simplex2((xx+x*blockSettings.chunk.XYZ)/100,(yy+y*blockSettings.chunk.XYZ)/100))*12;

	if(zz>=Math.round(heightLimit)){
	
		
	
		var blockIndex = xx+yy*blockSettings.chunk.XYZ+zz*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;
		if(zz==Math.round(heightLimit)){
		
		var blockType  = Math.round(Math.abs(noise.simplex2((xx+x*blockSettings.chunk.XYZ)/300,(yy+y*blockSettings.chunk.XYZ)/300))*3)+1;	

		switch(blockType){
			case 2:
				blockType=4;
			break;
			case 3:
				blockType=8;
			break;
		}
		
		chunk[chunkID].blockArray[blockIndex]=blockType;
		
		if(blockType==1){
			chance=Math.round(Math.random()*70)
			if(chance==1){
				scenery_change(xx+x*blockSettings.chunk.XYZ,yy+y*blockSettings.chunk.XYZ,zz+z*blockSettings.chunk.XYZ-1,Math.round(Math.random()*3)+1);		
			}
		}else{
			chance=Math.round(Math.random()*300)
			if(chance==1){
				scenery_change(xx+x*blockSettings.chunk.XYZ,yy+y*blockSettings.chunk.XYZ,zz+z*blockSettings.chunk.XYZ-1,2);		
			}		
		}
		}else{
		chunk[chunkID].blockArray[blockIndex]=4;
		}
	}

}
}
}	
	

}

function distance_3d( v1, v2 )
{
    var dx = v1[0] - v2[0];
    var dy = v1[1] - v2[1];
    var dz = v1[2] - v2[2];

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}


block_pathfind = function(blockStart,blockEnd){
	console.time();
	var chunkPosition = chunk_get(blockStart[0],blockStart[1],blockStart[2]);
	var chunkPositionTwo = chunk_get(blockEnd[0],blockEnd[1],blockEnd[2]);
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var chunkIDTwo = chunk_returnID(chunkPositionTwo[0],chunkPositionTwo[1],chunkPositionTwo[2]);
	if(chunk[chunkID]!=null && chunk[chunkIDTwo]!=null){
		
		//Same chunk
		if(chunkID == chunkIDTwo){
			
			pathChild.send({
				id : 'chunk_pathfind',
				chunkList : [[chunkID,chunk[chunkID].blockArray,chunk[chunkID].coords]],
				blockStart : blockStart,
				blockEnd : blockEnd,
				
			});
			

		}else{
			var chunkList=[];		
			var dist = Math.ceil(distance_3d(chunkPosition,chunkPositionTwo)*1.2);

			for(var xxx =-dist ; xxx<=dist; xxx++){
			for(var yyy =-dist ; yyy<=dist; yyy++){		
			for(var zzz =-dist ; zzz<=dist; zzz++){
								
				
				
				var chunkPos = chunk_get(blockStart[0],blockStart[1],blockStart[2]);
				var id = chunk_returnID(chunkPos[0]+xxx,chunkPos[1]+yyy,chunkPos[2]+zzz);			
				if(chunk[id]!=null){
					chunkList.push([id,chunk[id].blockArray,chunk[id].coords]);

				}
			
			}
			}
			}



			pathChild.send({
				id : 'chunk_pathfind',
				chunkList : chunkList,
				blockStart : blockStart,
				blockEnd : blockEnd,
				
			});							


				
		}
	}
	console.timeEnd();
}

block_get_node = function(x,y,z){
	var chunkPosition = chunk_get(x,y,z);
	var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
	var blockLocation = [(x) - (chunkPosition[0]*blockSettings.chunk.XYZ), (y) - (chunkPosition[1]*blockSettings.chunk.XYZ),(z) - (chunkPosition[2]*blockSettings.chunk.XYZ)]
	var blockIndex = blockLocation[0]+blockLocation[1]*blockSettings.chunk.XYZ+blockLocation[2]*blockSettings.chunk.XYZ*blockSettings.chunk.XYZ;

	if(chunk[chunkID]!=null){
		return(chunk[chunkID].nodes[blockIndex]);
	}
			
}


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
x = i % blockSettings.chunk.XYZ
y = Math.floor(( i / blockSettings.chunk.XYZ )) % blockSettings.chunk.XYZ
z = Math.floor(i / ( blockSettings.chunk.XYZ * blockSettings.chunk.XYZ ))
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




