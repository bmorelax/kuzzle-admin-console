angular.module('kuzzle.collection')

  .controller('CollectionFullCtrl', [
    '$scope',
    '$stateParams',
    'collectionApi',
    '$state',
    'schema',
    'previousState',
    '$window',
    'Notification',
    function ($scope, $stateParams, collectionApi, $state, schema, previousState, $window, notification) {

      $scope.isEdit = false;
      $scope.collection = {
        name: $stateParams.collection || $stateParams.newCollection,
        schema: ''
      };

      $scope.init = function (action) {
        if (action === 'edit') {
          $scope.isEdit = true;

          schema.get($scope.collection.name)
            .then(function (response) {
              $scope.collection.schema = angular.toJson(response.mapping, 4);
            })
            .catch(function (error) {

            });
        }
      };

      $scope.update = function (isCreate) {
        try {
          var collection = {
            name: $scope.collection.name,
            schema: JSON.parse($scope.collection.schema)
          };

          collectionApi.putMapping(collection, true, isCreate)
            .then(function () {
              $state.go('storage.browse.documents', {collection: $scope.collection.name});
            });
        }
        catch (e) {
          notification.error('Error parsing schema.');
        }
      };

      $scope.cancel = function () {
        if (!previousState.get()) {
          $state.go('collection.browse');
          return false;
        }

        $window.history.back();
      };
  }]);