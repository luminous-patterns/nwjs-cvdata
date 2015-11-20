'use strict';

var Q = require('q');
var fs = require('fs');
var util = require('util');
var path = require('path');

var EventEmitter = require('events');

var CvdFile = require('./CvdFile');

module.exports = class NodeApp extends EventEmitter {

    constructor (gui) {

        this.gui = gui;

        this.vendorLibraries = [];
        this.srcFiles = [];

        this.openFile = new CvdFile(gui);

        setInterval((function () { this.autosave(); }).bind(this), 5000);

    }

    get jobs () {
        return this.openFile.jobs;
    }

    newFile () {
        this.openFile = new CvdFile(this.gui);
        this.emit('file.changed', this.openFile);
        return this;
    }

    getSavedFilePath (filename) {
        return [this.gui.App.dataPath, filename].join(path.sep);
    }

    load (filePath) {
        console.log('loading', filePath);
        return Q.nfcall(fs.readFile, filePath, 'utf-8')
            .then((function (fileContents) {
                if (!fileContents) {
                    return;
                }
                this.openFile = new CvdFile(this.gui, JSON.parse(fileContents));
                this.emit('file.changed', this.openFile);
            }).bind(this));
    }

    loadAutosave () {
        return this.load(this.getSavedFilePath('autosave.json'))
            .catch(function (error) {
                console.log(error,error.stack);
            });
    }

    autosave () {
        var paths = [
            this.getSavedFilePath('autosave.json'),
            this.getSavedFilePath(util.format('autosave-%s.json', Date.now())),
        ];
        console.log('auto saving...',paths);
        return Q.all([
            this.saveAs(paths[0]),
            this.saveAs(paths[1]),
        ])
        .catch(function (err) {
            console.log(err);
        });
    }

    saveAs (path) {
        return Q.nfcall(
            fs.writeFile, 
            path, 
            JSON.stringify(this.openFile)
        )
        .catch(function (err) {
            console.log(err);
        });
    }

    addVendorLibraries (libs) {
        
        libs = libs || [];
        
        if (libs.length < 1) {
            throw new Error('First argument must include at least one library');
        }

        var vendorLibs = this.vendorLibraries;
        
        vendorLibs.push.apply(vendorLibs, libs);

        return this;

    }

    addSrcFiles (paths) {
        
        paths = paths || [];
        
        if (paths.length < 1) {
            throw new Error('First argument must include at least one file path');
        }

        var srcFiles = this.srcFiles;
        
        srcFiles.push.apply(srcFiles, paths);

        return this;

    }

    init () {
        this.setupScripts();
        this.loadAutosave();
    }

    setupScripts () {
        return this.createSingleScriptFile()
            .then(function () {

            });
    }

    createSingleScriptFile () {
        var loadedScripts = [];
        return this.loadScripts()
            .then((function (scripts) {
                loadedScripts.push.apply(loadedScripts, scripts);
                return this.saveScriptFile('(function () {\n'
                    + loadedScripts.join('\n') 
                    + '\n})();'
                );
            }).bind(this))
            .then((function () {
                var scriptEl = window.document.createElement('script');
                scriptEl.setAttribute('src', 'script.js');
                window.document.body.appendChild(scriptEl);
            }).bind(this))
            .catch(function (error) {
                console.log(error);
            });
    }

    getSingleScriptFilePath () {
        return 'script.js';
    }

    saveScriptFile (contents) {
        return Q.nfcall(fs.writeFile, 'script.js', contents);
    }

    loadScripts () {
        var scriptLoads = [];
        var paths = this.getAllScriptPaths();
        console.log('paths', paths);
        for (var i = 0; i < paths.length; i++) {
            scriptLoads.push(Q.nfcall(fs.readFile, paths[i], 'utf-8'));
        }
        return Q.all(scriptLoads);
    }

    getAllScriptPaths () {
        var paths = [];
        var vendorLibs = this.vendorLibraries;
        var srcFiles = this.srcFiles;
        var i;
        for (i = 0; i < vendorLibs.length; i++) {
            paths.push(['lib', vendorLibs[i]].join(path.sep))
        }
        for (i = 0; i < srcFiles.length; i++) {
            paths.push(['src', srcFiles[i]].join(path.sep))
        }
        return paths;
    }

    addVendorLibScripts () {
        var vendorLibs = this.vendorLibraries;
        if (vendorLibs.length > 0) {
            window.document.body.appendChild(
                window.document.createComment(' Vendor libraries ')
            );
        }
        for (var i = 0; i < vendorLibs.length; i++) {
            this.addScriptTag('lib', vendorLibs[i]);
        }
    }

    addSourceScripts () {
        var srcFiles = this.srcFiles;
        if (srcFiles.length > 0) {
            window.document.body.appendChild(
                window.document.createComment(' Source files ')
            );
        }
        for (var i = 0; i < srcFiles.length; i++) {
            this.addScriptTag('src', srcFiles[i]);
        }
    }

    addScriptTag (type, src) {
        var scriptEl = window.document.createElement('script');
        scriptEl.setAttribute('src', util.format('%s/%s', type, src));
        window.document.body.appendChild(scriptEl);
    }

    createJob () {
        var newJob = new Job();
        this.jobs.add(newJob);
        return newJob;
    }

};