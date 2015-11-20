'use strict';

var Entity = require('./Entity');

var RefCollection = require('./RefCollection');

module.exports = class Job extends Entity {
    
    constructor (cvdFile, attrs) {

        super.constructor(cvdFile, attrs);

        attrs = attrs || {};

        this.companyName = attrs.companyName || 'Company';
        this.title = attrs.title || 'Job Title';
        this.startDate = new Date(attrs.startDate || Date.now());
        this.endDate = new Date(attrs.endDate || Date.now());
        this.details = attrs.details || '';

        this.skills = new RefCollection(cvdFile.skills, attrs.skills && attrs.skills.modelIds || []);
        this.technologies = new RefCollection(cvdFile.technologies, attrs.technologies && attrs.technologies.modelIds || []);
        this.projects = new RefCollection(cvdFile.projects, attrs.projects && attrs.projects.modelIds || []);

    }

    get description () {
        return [this.title, this.companyName].join(' @ ');
    }

    toJSON () {
        return {
            id: this.id,
            companyName: this.companyName,
            title: this.title,
            startDate: this.startDate,
            endDate: this.endDate,
            details: this.details,
            skills: this.skills,
            technologies: this.technologies,
            projects: this.projects,
        };
    }
    
}