'use strict';

/**
 * @ngdoc function
 * @name gingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gingApp
 */
var gingApp = gingApp || angular.module('gingApp');

gingApp.controller('MainCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

	/*
	*  Google Custom Search API allows only 100 courtesy API calls. If the limit is hit, the app will render the sample data from ging.js
	*/
	var workOffline = function() {
		$scope.showPagination = false;
  	switch($scope.searchType) {
  		case 'video':
  			$scope.results = sampleData.videoResults.items
  			break;
  		case 'image':
  			$scope.results = sampleData.imageResults.items
  			break;
  		case 'web':
  			$scope.results = sampleData.webResults.items
  			break;
  		default:
  			$scope.results = [];
  	}
	};

	/*
	*		Constructs the url for quering the Google Custom Search API  based on different scopes.
	*/
	var getUrl = function(query, searchType) {
		var url = GING.base_url + '&q=' + query;

		if($scope.searchType == 'video') {
			url += '&cx=' + GING.video_search_id;
		} else {
			url += '&cx=' + GING.web_search_id
		}

		if($scope.searchType == 'image') {
			url += '&searchType=' + searchType;
		}
		return url;
	}

	/*
	*  Makes the XHR request and sets all the necessary data for the views.
	*  If the number of requests to the Google Custom API Reaches the limit the XHR fails and falls back to the sample data provided in the ging.js
	*/
	var makeRequest = function(url) {
		$http.get(url).success(function(data, status, headers, config) {
    	$scope.results = data.items || [];
    	if(data.queries.nextPage) {
    		$scope.nextStart = data.queries.nextPage[0].startIndex;
    	}
    	if(data.queries.previousPage) {
    		$scope.prevStart = data.queries.previousPage[0].startIndex;
    	}
    	$scope.showPagination = true;
    	$scope.searchTerms = data.queries.request[0].searchTerms
	  }).error(function(data, status, headers, config) {
	    if(status == 403) {
	    	workOffline();
	    }
	  });
	}

	/*
	*  Unsets the source of the iframe and hides the preview container.
	*/
	$scope.removePreview = function() {
		$scope.showPreview = false;
		$('#preview').attr('src', '');
	}

	/*
	* Shows the preview container and sets the position of the container. Also sets the source of the iframe to the video url with autoplay set.
	*/
	$scope.videoPreview = function($event, url) {
		$scope.showPreview = true;
		$scope.top = $event.screenY;
		$scope.left = $event.screenX;
		$scope.previewURL = $sce.trustAsResourceUrl(url + '?autoplay=1');
		$('#preview').attr('src', url + '?autoplay=1');
	}

	/*
	*  Renders the previous result set. (Ideally this should be cached)
	*/
	$scope.prev = function() {
		if ($scope.prevStart) {
			var url = getUrl($scope.searchTerms, $scope.searchType);
			url += '&start=' + $scope.prevStart;
			makeRequest(url);
		}
	}

	/*
	*  Renders the next result set.
	*/
	$scope.next = function() {
		if($scope.nextStart) {
			var url = getUrl($scope.searchTerms, $scope.searchType);
			url += '&start=' + $scope.nextStart;
			makeRequest(url);
		}
	}

	/*
	*  Sets the SearchType of the request and fires the query.
	*/
	$scope.search = function(query, searchType) {
		if(typeof searchType !== 'undefined') {
			$scope.searchType =  searchType;
		} else {
			if(typeof $scope.searchType === 'undefined') {
				$scope.searchType = 'web';
			}
		}

		if(!query) {
			$scope.results = [];
			$scope.showPagination = false;
			return;
		}

		if($scope.workOffline) {
			return workOffline();
		}

		makeRequest(getUrl(query, $scope.searchType));
	};
}]);
