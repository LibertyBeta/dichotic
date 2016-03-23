angular.module('dichotic').directive('dogDetails', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/components/dog/dog-details/dog-details.html',
    controllerAs: 'detailCtrl',
		controller: function ($scope, $reactive, $stateParams, $meteor, $location) {
			$reactive(this).attach($scope);
      // this.subscribe("games");
			this.helpers({
				dogs: () => {
		    	return Dogs.find({});
		  	},
				shows: () => {
					return Shows.find({})
				}
			});

    }
	}
});
