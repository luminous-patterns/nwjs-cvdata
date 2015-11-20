(function () {'use strict';

    var app = angular.module('cvDataApp');

    app.directive('simpleObjectList', simpleObjectList)
        .controller('SimpleObjectListController', SimpleObjectListController);

    simpleObjectList.$inject = ['$compile'];
    function simpleObjectList (  $compile) {

        return {
            restrict: 'E',
            controller: 'SimpleObjectListController',
            templateUrl: 'views/simpleObjectListController.html',
            scope: {
                ngModel: '=',
                title: '@listTitle',
                onAddListItem: '&',
                existingItems: '=',
                listItemRepository: '=',
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

    SimpleObjectListController.$inject = ['$scope'];
    function SimpleObjectListController (  $scope) {

        $scope.models = $scope.ngModel && $scope.ngModel.models || [];
        $scope.newItemLabel = '';
        $scope.addListItem = 'custom';

        $scope.repository = $scope.listItemRepository
            && $scope.listItemRepository.getIds()
            || [];

        $scope.$watch('ngModel', function (newValue) {
            $scope.models = newValue && newValue.models || [];
            $scope.repository = $scope.listItemRepository
                && $scope.listItemRepository.getIds()
                || [];
            $scope.newItemLabel = '';
        });

        $scope.$watch('addListItem', function (newValue) {
            if (newValue && 'custom' !== newValue) {
                $scope.ngModel.addRef(newValue);
                $scope.addListItem = 'custom';
            }
        })

        $scope.getEntity = function (entityId) {
            return $scope.listItemRepository.getById(entityId);
        };

        $scope.getEntityDescription = function (entityId) {
            return $scope.getEntity(entityId).label;
        };

        $scope.createNewItem = function () {
            if ($scope.ngModel) {
                var newItem = $scope.ngModel.createNew();
                newItem.label = $scope.newItemLabel;
                $scope.newItemLabel = '';
                $scope.onAddListItem({ $item: newItem });
            }
        };

    }

})();