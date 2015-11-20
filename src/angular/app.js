(function () {'use strict';

    var app = angular.module('cvDataApp', []);

    app.controller('ToolbarController', ToolbarController);

    ToolbarController.$inject = ['$rootScope', '$scope', 'CurrentFile'];
    function ToolbarController (  $rootScope,   $scope,   CurrentFile) {

        var saveAsEl = document.getElementById('saveAs');
        var loadFileEl = document.getElementById('loadFile');
        var saveAs = angular.element(saveAsEl);
        var loadFile = angular.element(loadFileEl);

        $scope.createJob = function () {
            var job = CurrentFile.createNewJob();
            $rootScope.$emit('jobSelected', job);
        };

        $scope.createProject = function () {
            var project = CurrentFile.createNewProject();
            $rootScope.$emit('projectSelected', project);
        };

        $scope.load = function () {
            loadFileEl.click();
        };

        $scope.saveAs = function () {
            saveAsEl.click();
        };

        $scope.startFresh = function () {
            var confirmed = window.confirm('Click \'OK\' to remove all jobs');
            if (confirmed) {
                process.nodeApp.newFile();
            }
        };

        saveAs.bind('change', function ($event) {
            var newValue = saveAsEl.value;
            if (newValue) {
                process.nodeApp.saveAs(newValue);
                saveAsEl.value = '';
            }
        });

        loadFile.bind('change', function ($event) {
            var newValue = loadFileEl.value;
            if (newValue) {
                process.nodeApp.load(newValue);
                saveAsEl.value = '';
            }
        });

    }

    app.controller('JobNavController', JobNavController);

    JobNavController.$inject = ['$rootScope', '$scope', 'CurrentFile'];
    function JobNavController (  $rootScope,   $scope,   CurrentFile) {

        $scope.jobs = CurrentFile.jobModels;
        $scope.skills = CurrentFile.skillModels;
        $scope.projects = CurrentFile.projectModels;

        process.nodeApp.on('file.changed', function () {

            $scope.jobs = CurrentFile.jobModels;
            $scope.skills = CurrentFile.skillModels;
            $scope.projects = CurrentFile.projectModels;

            if ($scope.$$phase) {
                return;
            }

            $scope.$apply();

        });

        $scope.editJob = function (job) {
            $rootScope.$emit('jobSelected', job);
        };

        $scope.editProject = function (project) {
            $rootScope.$emit('projectSelected', project);
        };

    }

    app.controller('EditJobController', EditJobController);

    EditJobController.$inject = ['$rootScope', '$scope', 'CurrentFile'];
    function EditJobController (  $rootScope,   $scope,   CurrentFile) {

        $scope.job = {};
        $scope.jobSelected = false;
        
        $scope.project = {};
        $scope.projectSelected = false;

        $scope.allSkills = CurrentFile.skills;
        $scope.allTechnologies = CurrentFile.technologies;

        $scope.jobs = CurrentFile.jobs.getIds();

        $scope.getJobDescription = function (jobId) {
            return CurrentFile.jobs.getById(jobId).description;
        };

        function refreshJobList () {
            $scope.jobs = CurrentFile.jobs.getIds();
        }

        function listenForNewJobs () {
            CurrentFile.jobs.on('change', function () {
                console.log('changed');
                refreshJobList();
            });
        }

        listenForNewJobs();

        process.nodeApp.on('file.changed', function () {
            refreshJobList();
            listenForNewJobs();
            clearSelectedJob();
            clearSelectedProject();
        });

        $rootScope.$on('jobSelected', function ($event, selectedJob) {
            selectJob(selectedJob);
        });

        $rootScope.$on('projectSelected', function ($event, selectedProject) {
            selectProject(selectedProject);
        });

        function selectProject (project) {
            clearSelectedJob();
            $scope.project = project;
            $scope.projectSelected = true;
        }

        function selectJob (job) {
            clearSelectedProject();
            $scope.job = job;
            $scope.jobSelected = true;
        }

        function clearSelectedProject () {
            $scope.project = {};
            $scope.projectSelected = false;
        }

        function clearSelectedJob () {
            $scope.job = {};
            $scope.jobSelected = false;
        }

    }

    app.service('CurrentFile', CurrentFile);

    CurrentFile.$inject = [];
    function CurrentFile () {

        this.jobs = process.nodeApp.openFile.jobs;
        this.jobModels = process.nodeApp.openFile.jobs.models;

        this.skills = process.nodeApp.openFile.skills;
        this.skillModels = process.nodeApp.openFile.skills.models;

        this.technologies = process.nodeApp.openFile.technologies;
        this.technologyModels = process.nodeApp.openFile.technologies.models;

        this.projects = process.nodeApp.openFile.projects;
        this.projectModels = process.nodeApp.openFile.projects.models;

        this.createNewJob = function () {
            return this.jobs.createNew();
        };

        this.createNewProject = function () {
            console.log(this.projects);
            return this.projects.createNew();
        };

        process.nodeApp.on('file.changed', (function (newFile) {

            this.jobs = newFile.jobs;
            this.jobModels = newFile.jobs.models;

            this.skills = newFile.skills;
            this.skillModels = newFile.skills.models;

            this.technologies = newFile.technologies;
            this.technologyModels = newFile.technologies.models;

            this.projects = newFile.projects;
            this.projectModels = newFile.projects.models;

        }).bind(this));

    }

})();