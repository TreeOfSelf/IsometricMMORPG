entity = [];
activeEntity = [];




entity_create = function(id,type){
	entity[id]={
	id : id,
	position : [0,0,0],
	drawPosition : [0,0,0],
	alive : 1,
	type : type,
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

entity_get_texture = function(id){

		switch(entity[id].type){
			case 0:
			return([0,0]);
			break;
			case 1:
			return([71/140,0]);
			break;
		}
}