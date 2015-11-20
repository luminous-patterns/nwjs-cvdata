(function () {'use strict';

    var app = angular.module('cvDataApp');

    app.directive('jobProjects', jobProjects)
        .controller('JobProjects', JobProjects);

    jobProjects.$inject = ['$compile'];
    function jobProjects (  $compile) {

        return {
            restrict: 'E',
            controller: 'JobProjects',
            templateUrl: 'views/jobProjects.html',
            scope: {
                ngModel: '=',
                title: '@listTitle',
                onAddListItem: '&',
            },
            compile: function () {

                return {
                    pre: function (scope, tElement, tAttrs, ctrl) {

                    },
                    post: function (scope, tElement, tAttrs, ctrl) {

                    }
                }

            },
        };

    }

    JobProjects.$inject = ['$scope'];
    function JobProjects (  $scope) {

        $scope.models = $scope.ngModel && $scope.ngModel.models || [];
        $scope.newItemLabel = '';

        $scope.$watch('ngModel', function (newValue) {
            $scope.models = newValue && newValue.models || [];
            $scope.newItemLabel = '';
        });

        $scope.createNewItem = function () {
            if ($scope.ngModel) {
                var newItem = $scope.ngModel.createNew();
                newItem.label = $scope.newItemLabel;
                $scope.newItemLabel = '';
                $scope.onAddListItem({ $item: newItem });
            }
        }

    }

})();