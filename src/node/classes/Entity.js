'use strict';

var uuid = require('node-uuid');
var EventEmitter = require('events');

module.exports = class Entity extends EventEmitter {
    
    constructor (cvdFile, attrs) {

        attrs = attrs || {};

        this.cvdFile = cvdFile;
        this.id = attrs.id || uuid.v4();

    }

    toJSON () {
        return {
            id: this.id,
        };
    }
    
}