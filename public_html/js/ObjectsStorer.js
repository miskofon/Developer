
function DevObject() {
    this.id = null;
    this.objectType = null;
}
;

function DevDatabase() {
    this.objects = [];
}
;

DevDatabase.prototype.addObject = function (object) {
    if (object instanceof DevObject) {
        if (_.indexOf(this.objects, {'id': object.id}) == -1) {
            this.objects.push(object);
            return true;
        }
    }
    return false;
};

DevDatabase.prototype.getObjectsBy = function (filter) {
    if (filter == undefined) {
        return [];
    }
    return _.where(this.objects, filter);
};

DevDatabase.prototype.getObjects = function (checker) {
    if (checker == undefined || typeof(checker) != 'function') {
        return this.objects;
    }
    var foundObjects = [];
    $.each(this.objects, function (index, object) {
        if (checker(object)) {
            foundObjects.push(object);
        }
    });
    return foundObjects;
    
};