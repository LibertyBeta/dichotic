angular.module('dichotic').directive('dogTag',function(){
	return{
		restrict: 'E',
		scope:{
			dog:"=",

		},
		link: function($scope, elem, attr){
			// console.log("SHOW VALUE",$scope.show);
		},
		templateUrl: 'client/components/dog/dog-tag/dog-tag.html'
	};
});
