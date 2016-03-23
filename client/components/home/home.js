angular.module('dichotic').directive('index', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/components/home/home.html',
    controllerAs: 'homeCtrl',
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

      this.addDog = () =>{
        Dogs.insert(this.dogForm);
        this.dogForm = {};
      }
    }
	}
});
