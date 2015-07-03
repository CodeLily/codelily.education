'use strict';

angular.module('core').controller('MailingListSignupController', ['$scope', '$http', '$location',
	function($scope, $http, $location) {

		$scope.subscribeEmail = function() {
			$http.post('/mail/subscribe/d7142be008', $scope.user)
				.success(function(response) {
					delete $scope.user;
					$scope.mailingListForm.$setPristine();
					$scope.success = response.message;
					delete $scope.error;
				})
				.error(function(error) {
					$scope.error = error.message;
				});
		};
	}
]);
