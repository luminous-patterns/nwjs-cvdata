'use strict';

var Entity = require('./Entity');

module.exports = class Technology extends Entity {
    
    constructor (cvdFile, attrs) {

        super.constructor(cvdFile, attrs);

        attrs = attrs || {};

        this.label = attrs.label || '';

    }

    toJSON () {
        return {
            id: this.id,
            label: this.label,
        };
    }
    
}