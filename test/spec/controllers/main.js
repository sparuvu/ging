'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('gingApp'));

  var MainCtrl, scope, searchResultsResponse, httpBackend;

  // Initialize the controller, mock scope and
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
    httpBackend = $injector.get('$httpBackend');
    var url = new RegExp('https://www.googleapis.com/customsearch.*')
    searchResultsResponse = httpBackend.when('GET', url)
                            .respond({});
  }));

  describe('::search ', function() {
    it('should always set the SearchType to web', function () {
      scope.search('xyz');
      expect(scope.searchType).toBe('web');
    });

    it('should set the SearchType to whatever is passed', function () {
      scope.search('xyz', 'video');
      expect(scope.searchType).toBe('video');
    });

    it('SearchType should persist its value', function () {
      scope.search('xyz', 'video');
      expect(scope.searchType).toBe('video');
      scope.search('xyz');
      expect(scope.searchType).toBe('video');
    });
  });

  describe('::videoPreview', function() {
    it(' should set the showPreview flag to true', function(){
      scope.videoPreview({screenY: 0, screenX: 10}, 'someFakeURL');
      expect(scope.showPreview).toBe(true);
    });

    it(' should set the top position of the preview container', function(){
      scope.videoPreview({screenY: 0, screenX: 10}, 'someFakeURL');
      expect(scope.top).toBe(0);
    });

    it(' should set the left the position of the preview container', function(){
      scope.videoPreview({screenY: 0, screenX: 10}, 'someFakeURL');
      expect(scope.left).toBe(10);
    });

    it(' should set the previewURL', function(){
      scope.videoPreview({screenY: 0, screenX: 10}, 'someFakeURL');
      expect(scope.previewURL.$$unwrapTrustedValue()).toBe('someFakeURL?autoplay=1');
    });

    it(' should set the src of the iframe', function(){
      setFixtures(sandbox({
        id: 'preview',
        src: ''
      }));
      scope.videoPreview({screenY: 0, screenX: 10}, 'someFakeURL');
      expect($('#preview')).toHaveAttr('src', 'someFakeURL?autoplay=1');
    });
  });

  describe('::removePreview', function() {
    it(' should set the showPreview to false', function(){
      scope.removePreview();
      expect(scope.showPreview).toBe(false);
    });

    it(' should unset the src of the iframe', function(){
      setFixtures(sandbox({
        id: 'preview',
        src: 'someValue'
      }));
      scope.removePreview();
      expect($('#preview')).toHaveAttr('src', '');
    });
  });

  describe('::prev', function() {
    beforeEach(function(){
      scope.prevStart = 1;
      scope.query = "abc";
      scope.searchType = "web";
    });

    it(' should set the results', function(){
      searchResultsResponse.respond(200, {items: [], queries: {
        request: [{
          searchTerms: "abc"
        }]
      }});
      scope.prev();
      httpBackend.flush();
      expect(scope.results.length).toBe(0);
    });

    it(' should not make a request when the prevStart is not set', function() {
      scope.nextStart = null;
      scope.prev();
      expect(scope.results).toBe(undefined);
    });
  });


  describe('::next', function() {
    beforeEach(function(){
      scope.nextStart = 11;
      scope.query = "abc";
      scope.searchType = "web";
    });

    it(' should set the results', function() {
      searchResultsResponse.respond(200, {items: [], queries: {
        request: [{
          searchTerms: "abc"
        }]
      }});
      scope.next();
      httpBackend.flush();
      expect(scope.results.length).toBe(0);
    });

    it(' should not make a request when the nextStart is not set', function() {
      scope.nextStart = null;
      scope.next();
      expect(scope.results).toBe(undefined);
    });
  });
});
