'use strict';

var EventEmitter = require('events');

module.exports = class RefCollection extends EventEmitter {
    
    constructor (collection, ids) {

        ids = ids || [];

        this.collection = collection;
        this.modelIds = [];
        this.models = [];

        if (ids.length > 0) {
            for (var i = 0; i < ids.length; i++) {
                this.addRef(ids[i]);
            }
        }

    }

    reset () {
        this.modelIds.splice(0, this.modelIds.length);
        this.emit('change');
        return this;
    }

    createNew () {
        var model = this.collection.createNew();
        this.addRef(model.id);
        return model;
    }

    addRef (modelId) {

        if (this.indexOf(modelId) === -1) {
            this.modelIds.push(modelId);
            this.models.push(this.collection.getById(modelId));
            this.emit('change');
        }

    }

    indexOf (modelId) {
        return this.modelIds.indexOf(modelId);
    }

    toJSON () {
        return {
            modelIds: this.modelIds,
        };
    }
    
}