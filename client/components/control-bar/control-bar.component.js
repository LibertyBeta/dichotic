angular.module('dichotic').directive('controlBar',function(){
	return{
		restrict: 'E',
		scope:{
			userId:"=",

		},
		link: function($scope, elem, attr){
			console.log("SHOW VALUE",$scope.show);
		},
		templateUrl: 'client/components/control-bar/control-bar.html'
	};
});
