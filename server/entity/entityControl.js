entity_create = function(id){
	entity[id]={
	id : id,
	position : [0,0,0],
	alive : 1,
	type : 1,
	};
	activeEntity.push(id);
	return(entity[id]);
}

entity_remove = function(id){
	var entityIndex = activeEntity.indexOf(id);
	if(entityIndex!=-1){
		activeEntity.splice(entityIndex,1);
		entity[id].alive=0;
	}
}












