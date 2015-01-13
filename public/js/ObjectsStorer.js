

function DevObject() {
	this.id = null;
	this.objectType = null;
};

function DevDatabase() {
	this.objects = [];
};

DevDatabase.prototype.addObject = function(object) {
	if (object instanceof DevObject) {				
		if (_.where(this.objects, {'id': object.id}) == undefined) {
			this.objects.push(object);
			return true;
		}
	}
	return false;
};

DevDatabase.prototype.getObjectsBy = function(filter) {
	if (filter == undefined) {
		return [];
	}
	return _.where(this.objects, filter);
};