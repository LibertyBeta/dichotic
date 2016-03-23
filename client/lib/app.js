angular.module('dichotic',['angular-meteor', 'ui.router']);
// var app = angular.module('dichotic');
// angular.module('dichotic').run(['$rootScope', '$state', function($rootScope, $state) {
// 	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, rejection) {
// 		if (rejection === 'AUTH_REQUIRED') {
// 			$state.go("index");
// 			console.log("HIT AUTH ERROR");
// 		}
//
// 		if (rejection === 'DM_AUTH_REQUIRED') {
// 			$state.go("home");
// 			console.log("HIT AUTH ERROR");
// 		}
// 	});
//
// 	Accounts.onLogin(function () {
// 		console.log("Logging in");
//     if($state.is('index')){
// 			$state.go('home');
// 		}
//
// 		if($state.is('login')){
// 			$state.go('home');
// 		}
//
// 		if($state.is('register')){
// 			$state.go('home');
// 		}
//   });
//
// 	Accounts.onLoginFailure(function () {
// 			console.log("FAILURE LOGIN");
//
// 			if(!$state.is('register') && !$state.is('login')){
// 				$state.go('index');
// 			}
// 			// $state.go('index');
//
//   });
//
// 	$rootScope.$watch('currentUser', function(){
// 		if (!Meteor.loggingIn()) {
// 			if (Meteor.user() === null) {
// 				$state.go("index");
// 			}
// 		}
//
// 	});
//
//
// }]);

angular.module('dichotic').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
	function($urlRouterProvider, $stateProvider, $locationProvider){

		$locationProvider.html5Mode(true);

		// console.log(Meteor.userId());

		$stateProvider
			.state('home', {
				url: '/home',
				template: '<home-view></home-view>',
				// templateUrl: 'templates/home.ng.html',
				// controller: 'HomeCtrl',
				// resolve: {
		    //   currentUser: ($q) => {
		    //     var deferred = $q.defer();
        //
		    //     Meteor.autorun(function () {
		    //       if (!Meteor.loggingIn()) {
		    //         if (Meteor.user() === null) {
		    //           deferred.reject('AUTH_REQUIRED');
		    //         } else {
		    //           deferred.resolve(Meteor.user());
		    //         }
		    //       }
		    //     });
        //
		    //     return deferred.promise;
		    //   }
		    // }
		 })
			.state('index', {
				url: '/',
				template: '<index></index>',
			})
			.state('details', {
				url: '/dog/:id',
				template: '<dog-details></dog-details>',
			})
			.state('register', {
				url: '/register',
				templateUrl: 'templates/register.ng.html',
				controller: 'RegisterCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'templates/login.ng.html',
				controller: 'LoginCtrl',
				currentUser: ($q) => {
	        var deferred = $q.defer();

	        Meteor.autorun(function () {
	          if (!Meteor.loggingIn()) {
	            if (Meteor.user() != null) {
	              deferred.reject('AUTH_REQUIRED');
	            } else {
	              deferred.resolve(Meteor.user());
	            }
	          }
	        });

	        return deferred.promise;
	      }
			});

		$urlRouterProvider.otherwise('/');
}]);
