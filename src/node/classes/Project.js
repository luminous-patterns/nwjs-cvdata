'use strict';

var Entity = require('./Entity');

var RefCollection = require('./RefCollection');

module.exports = class Project extends Entity {
    
    constructor (cvdFile, attrs) {

        super.constructor(cvdFile, attrs);

        attrs = attrs || {};

        this.name = attrs.name || 'New project';
        this.product = attrs.product || '';
        this.teamSize = attrs.teamSize || 1;
        this.myRole = attrs.myRole || '';
        this.details = attrs.details || '';

        this.job = attrs.job || '';

        this.skills = new RefCollection(cvdFile.skills, attrs.skills && attrs.skills.modelIds || []);
        this.technologies = new RefCollection(cvdFile.technologies, attrs.technologies && attrs.technologies.modelIds || []);

    }

    toJSON () {
        return {
            id: this.id,
            name: this.name,
            product: this.product,
            teamSize: this.teamSize,
            myRole: this.myRole,
            details: this.details,
            job: this.job,
            skills: this.skills,
            technologies: this.technologies,
        };
    }
    
}