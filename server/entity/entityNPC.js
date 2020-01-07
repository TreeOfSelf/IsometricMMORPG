npc_create = function(){
	
	
	var id = -(NPC.length+1);
	
	var entityRef = entity_create(id,1);
	
	NPC[id]={
	id : id,
	entity : entityRef,
	alive : 1,
	};
	activeNPC.push(id);
	
	entityRef.position[2]=-1;
	message_send_tcp_all(['connect_player',id,entityRef.position[0],entityRef.position[1],entityRef.position[2],1]);
	
}

npc_remove = function(id){
	var NPCindex = activeNPC.indexOf(id);
	if(NPCindex!=-1){
		activeNPC.splice(NPCindex,1);
		NPC[id].alive=0;
	}
}