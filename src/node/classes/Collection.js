'use strict';

var _ = require('underscore');
var EventEmitter = require('events');

module.exports = class Collection extends EventEmitter {
    
    constructor (cvdFile, ObjectClass, objects) {

        objects = objects || [];

        this.cvdFile = cvdFile;
        this.ObjectClass = ObjectClass;
        this.models = [];

        if (objects.length > 0) {
            for (var i = 0; i < objects.length; i++) {
                this.add(new ObjectClass(cvdFile, objects[i]));
            }
        }

    }

    reset () {
        this.models.splice(0, this.models.length);
        this.emit('change');
        return this;
    }

    createNew () {
        var model = new this.ObjectClass(this.cvdFile);
        this.add(model);
        return model;
    }

    getById (id) {

        var model;

        for (var i = 0; i < this.models.length; i++) {
            model = this.models[i];
            if (id === model.id) {
                return model;
            }
        }

    }

    getIds () {
        return _.pluck(this.models, 'id');
    }

    add (model) {

        if (!(model instanceof this.ObjectClass)) {
            throw new Error('Invalid type');
        }

        if (this.indexOf(model) === -1) {
            this.models.push(model);
            this.emit('change');
        }

    }

    indexOf (model) {
        return this.models.indexOf(model);
    }

    toJSON () {
        return {
            models: this.models,
        };
    }
    
}