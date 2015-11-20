'use strict';

var EventEmitter = require('events');

var Job = require('./Job');
var Skill = require('./Skill');
var Project = require('./Project');
var Technology = require('./Technology');
var Collection = require('./Collection');

module.exports = class CvdFile extends EventEmitter {

    constructor (gui, attrs) {

        attrs = attrs || {};

        this.gui = gui;

        this.skills = new Collection(this, Skill, attrs.skills && attrs.skills.models || []);
        this.technologies = new Collection(this, Technology, attrs.technologies && attrs.technologies.models || []);
        this.projects = new Collection(this, Project, attrs.projects && attrs.projects.models || []);
        this.jobs = new Collection(this, Job, attrs.jobs && attrs.jobs.models || []);

    }

    toJSON () {
        return {
            jobs: this.jobs,
            skills: this.skills,
            technologies: this.technologies,
            projects: this.projects,
        };
    }

};