
const blockControl = require('./block/blockControl.js');
const fileControl = require('./file/fileControl.js');


//Requires

var Peer = require('simple-peer')
var wrtc = require('wrtc')
var WebSocket = require('ws');
const myRL = require('serverline')
var colors = require('colors');


var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);


//Clear console
process.stdout.write('\x1Bc')


//Allow input of text to be evaluated into code
myRL.init({
	prompt : '<'.green,
	colorMode : true,
	
})
myRL.setCompletion(['activeClients','message_send',])
 
myRL.on('line', function(line) {
	try {
		var result = eval(line);
		if(result!=null){
			console.log(result.toString().bold.brightRed);
		}
	} catch(e){
		//Only display the first line of the error
		console.log((e.toString().split('\n')[0]).red);
	}	
});


//List of users
clients = [];


//List of active users
activeClients = [];

//Start the websocket server
/*
	This is the TCP connection we use to start the webRTC UDP connection
*/
const wss = new WebSocket.Server({
  port: 8080,
});


//Sets a clients state to disconnected and removes from active client list
function disconnectClient(clientID){
	clients[clientID].connected=0;
	clients[clientID].elevation=0;
	//Remove from our active clients list if it is present in it
	var clientIndex = activeClients.indexOf(clientID);
	if(clientIndex!=-1){
		activeClients.splice(clientIndex,1);
	}
	message_send_tcp_all(['connect_disconnect',clientID]);
	console.log(('Disconnected: '+clientID).brightRed);	
}

//Reacts to certain packet types
function message_receive(data,connectID){
	
	//Check if it is an array, if so set first index to switch input, if not, set the whole value to switch value
	if(Array.isArray(data)==true){
		var switchValue = data[0];
	}else{
		var switchValue = data;
	}

	switch(switchValue){
		
		case "connect_signal":
			clients[connectID].UDP.signal(JSON.parse(data[1]));			
		break;
		case "connect_latency_udp":
			message_send_udp('connect_latency_udp',connectID);
		break;
		case "connect_latency_tcp":
			message_send_tcp('connect_latency_tcp',connectID);
		break;
		case "block_change":
			block_change(data[1],data[2],data[3],data[4]);
			message_send_tcp_all(['block_change',data[1],data[2],data[3],data[4]]);
		break;
		case "scenery_change":
			if(block_check(data[1],data[2],data[3])==0 && block_check(data[1],data[2],data[3]+1)!=0 && block_check(data[1],data[2],data[3]-1)==0 ){
			
				data[1]+=Math.random()*0.45-Math.random()*0.45;
				data[2]+=Math.random()*0.45-Math.random()*0.45;
				scenery_change(data[1],data[2],data[3],data[4]);
				message_send_tcp_all(['scenery_change',data[1],data[2],data[3],data[4]]);		

			}			
		break;
		case "player_position":
			clients[connectID].position=[data[1],data[2],data[3]];
			message_send_udp_all(['player_move',connectID,data[1],data[2],data[3]]);
		break;
	}
}



message_send = function(data,connectID){
	
	if(clients[connectID].connected==1){
		
		switch(clients[connectID].elevation){
			//TCP
			case 1:
				clients[connectID].TCP.send(JSON.stringify(data));
			break;
			//UDP
			case 2:
				clients[connectID].UDP.send(JSON.stringify(data));
			break;
		}
		
	}
}

message_send_all =function(data){
	
	for(var k=0 ;k<activeClients.length;k++){
		var connectID = activeClients[k]
		if(clients[connectID].connected==1){
			
			switch(clients[connectID].elevation){
				//TCP
				case 1:
					clients[connectID].TCP.send(JSON.stringify(data));
				break;
				//UDP
				case 2:
					clients[connectID].UDP.send(JSON.stringify(data));
				break;
			}
			
		}
	}
}


message_send_tcp=function(data,connectID){
	
	if(clients[connectID].connected==1){
		clients[connectID].TCP.send(JSON.stringify(data));			
	}
}

 message_send_tcp_all=function(data){
	for(var k=0 ;k<activeClients.length;k++){
		var connectID = activeClients[k]
		if(clients[connectID].connected==1){
			clients[connectID].TCP.send(JSON.stringify(data));			
		}
	}
}

message_send_udp=function(data,connectID){
	
	if(clients[connectID].connected==1 && clients[connectID].elevation==2){
		clients[connectID].UDP.send(JSON.stringify(data));			
	}
}

message_send_udp_all=function(data){
	for(var k=0 ;k<activeClients.length;k++){
		var connectID = activeClients[k]
		if(clients[connectID].connected==1){
			clients[connectID].UDP.send(JSON.stringify(data));			
		}
	}
}


//Update tick
setInterval(function(){
	for(var k=0;k<activeClients.length;k++){
		var clientID = activeClients[k];
		if(clients[clientID].connected==1){

			for(var xx=-3;xx<=3;xx++){					
			for(var yy=-3;yy<=3;yy++){
			for(var zz=-3;zz<=3;zz++){
				
			var chunkPosition = chunk_get(clients[clientID].position[0]+xx*blockSettings.chunk.XYZ,clients[clientID].position[1]+yy*blockSettings.chunk.XYZ,clients[clientID].position[2]+zz*blockSettings.chunk.XYZ);			
			var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
			//If chunk is not loaded
			if(clients[clientID].loaded.indexOf(chunkID)==-1 && (chunk[chunkID]!=null || chunkPosition[2]==0)){
				
				if(chunk[chunkID]==null){
					chunk_create(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
					chunk_generate(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
				}
				
				clients[clientID].loaded.push(chunkID);
				message_send_tcp(['map_load',JSON.stringify(chunkPosition),LZString.compressToUTF16(chunk[chunkID].blockArray.toString()),LZString.compressToUTF16(JSON.stringify(chunk[chunkID].sceneryArray))],clientID);
			}
			
			}}}
		}
	}
},100);


//When we get a connection our webSocket connection
wss.on('connection', function connection(ws) {
		
	//Get our connection ID
	var connectID = clients.length;
	clients.push({
		clientID : connectID,
		UDP : 0,
		TCP : ws,
		connected : 1,
		elevation : 1,
		loaded : [],
		position : [0,0,0],
	});
	
	message_send_tcp(['connect_id',connectID],connectID);
	
	message_send_tcp_all(['connect_player',connectID,0,0,0]);
	
	for(var k=0; k<activeClients.length; k++){
		var id = activeClients[k];
		message_send_tcp(['connect_player',id,clients[k].position[0],clients[k].position[1],clients[k].position[2]],connectID);
	}
	
	ws.onclose = function(){
		disconnectClient(connectID);
	}
	
	ws.onerror = function(err){
		disconnectClient(connectID);
		console.log(('error', err.toString().split('\n')[0]).red)
	}
	

	//When we receive a websocket message
	ws.on('message', function incoming(message) {
		//React to message 
		message=JSON.parse(message);
		//console.log(('TCP data from '+connectID+': '+message).magenta);
		message_receive(message,connectID);

	});
	
	console.log(('Connected TCP: '+connectID).brightGreen);

	
	//Create new peer for webRTC
	clients[connectID].UDP = new Peer({
	  initiator: false,
	  channelConfig: {
		  ordered : false,
		  maxRetransmits :0,
		  
	  },
	  channelName: Math.random().toString(),
	  config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] },
	  offerOptions: {},
	  answerOptions: {},
	  sdpTransform: function (sdp) { return sdp },
	  stream: false,
	  streams: [],
	  trickle: true,
	  allowHalfTrickle: false,
	  wrtc: wrtc,
	  objectMode: false
		
	}) 

	clients[connectID].UDP.on('signal', data => {
		message_send(['connect_signal',JSON.stringify(data)],connectID)
	})
	
	clients[connectID].UDP.on('connect', () => {
		console.log(('Connected UPD: '+connectID).brightGreen);
		clients[connectID].elevation=2;
		activeClients.push(connectID);
		message_send('UDP connected',connectID)
	})
	
	//Only log the first line of the error 
    clients[connectID].UDP.on('error', err => {
		if(clients[connectID].connected==1){
			disconnectClient(connectID);
			console.log(('error', err.toString().split('\n')[0]).red)
		}
	})
	
	
	clients[connectID].UDP.on('data', data => {
		data = JSON.parse(data);
		//console.log(('UDP data from '+connectID+': '+data).magenta);
		message_receive(data,connectID);
	})
		


});


