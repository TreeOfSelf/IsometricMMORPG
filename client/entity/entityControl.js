entity = [];
activeEntity = [];



entity_create = function(id){
	entity[id]={
	id : id,
	position : [0,0,0],
	drawPosition : [0,0,0],
	alive : 1,
	};
	activeEntity.push(id);
}

entity_remove = function(id){
	var entityIndex = activeEntity.indexOf(id);
	if(entityIndex!=-1){
		activeEntity.splice(entityIndex,1);
		entity[id].alive=0;
	}
}