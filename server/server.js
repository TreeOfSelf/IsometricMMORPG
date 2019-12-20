
const blockControl = require('./block/blockControl.js');
const fileSave = require('./file/fileSave.js');

//Requires

var Peer = require('simple-peer')
var wrtc = require('wrtc')
var WebSocket = require('ws');
const myRL = require('serverline')
var colors = require('colors');

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

			for(var xx=-1;xx<=1;xx++){					
			for(var yy=-1;yy<=1;yy++){
			for(var zz=-1;zz<=1;zz++){
				
			var chunkPosition = chunk_get(clients[clientID].position[0]+xx,clients[clientID].position[1]+yy,clients[clientID].position[2]+zz);			
			var chunkID = chunk_returnID(chunkPosition[0],chunkPosition[1],chunkPosition[2]);
			//If chunk is not loaded
			if(clients[clientID].loaded.indexOf(chunkID)==-1 && chunk[chunkID]!=null){
				clients[clientID].loaded.push(chunkID);
				message_send_tcp(['map_load',JSON.stringify(chunkPosition),JSON.stringify(Array.prototype.slice.call(chunk[chunkID].blockArray)),JSON.stringify(chunk[chunkID].sceneryArray)],clientID);
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
		console.log(('TCP data from '+connectID+': '+message).magenta);
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
		console.log(('UDP data from '+connectID+': '+data).magenta);
		message_receive(data,connectID);
	})
		


});


