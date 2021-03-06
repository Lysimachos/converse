(function() {
  'use strict';

  angular
    .module('supermodular.wordpress')
    .factory('db', [function() {
      return new Firebase('https://converse-3fa91.firebaseio.com/');
    }])
    .factory('wordpressService', wordpressService);
  wordpressService.$inject = ['db', '$http', '$q', '_', 'htmlToPlainText', '$firebaseArray', '$firebaseObject'];

  /* @ngInject */
  function wordpressService(db, $http, $q, _, htmlToPlainText, $firebaseArray, $firebaseObject) {
    var url = 'http://demo.titaniumtemplates.com/wordpress/?json=1';
    var articles = [];
    var favorites = [];
    var searchResults = [];
    var example_json = [{
      id: 1234,
      title: 'Advanced Fluid Statics kai arkoudes kai oti allo thes gia na gemisei tin seira',
      logo: 'http://innochain.net/wp-content/uploads/102_01.jpg',
      date_start: '18/5/2016',
      date_end: '18/5/2016',
      location: 'Xanthi',
      coordinates: 'Map Location',
      venue: 'Duth Lobby',
      contact: 'Call me @ 6987654321',
      about: 'This is a non existent conferece',
      organizer: 'Somebody',
      link: 'url',
      schedule: {
        1: {
          sub_id: 1,
          start_time: '12:00',
          end_time: '13:00',
          date: '2016-05-18',
          title: 'Entry Level Fluid Dynamics',
          speaker: 'Romaidis Orfeas',
          description: 'Text description.. This course signifies the importance of lorem ipsum text. Which is realy important to showcase large portions of text. Incuded in a description box for testing purposes',
          file: 'url',
          vanue: 'Loby A',
          image: 'https://www.newton.ac.uk/files/covers/968361.jpg',
        },
        2: {
          sub_id: 2,
          start_time: '13:00',
          end_time: '14:00',
          date: '2016-05-18',
          title: 'Secondary Level Fluids',
          speaker: 'Polychronis Christos',
          description: 'Text description.. This course signifies the importance of lorem ipsum text. Which is realy important to showcase large portions of text. Incuded in a description box for testing purposes',
          file: 'url',
          vanue: 'Loby A',
          image: 'http://feelgrafix.com/data_images/out/13/877592-random-wallpaper.jpg',
        },
      },
    }, ];
    var service = {
      getArticles: getArticles,
      getArticle: getArticle,
      addFavorites: addFavorites,
      removeFavorite: removeFavorite,
      getFavorites: getFavorites,
      isFavorite: isFavorite,
      getSearchResults: getSearchResults,
      searchFor: searchFor
    };
    return service;
    ////////////////

    function getArticles() {
      var query = db.child('sizzling-torch-5385');
      return $firebaseArray(db).$loaded().then(initArray);
      /*return $http.get(url)
      	.then(function(response) {
      	articles=example_json;
      	return example_json;
      	});
      	*/
    }

    function getArticle(articleId) {
      if (articles.length) {
        return $q.when(_.find(articles, 'id', articleId));
      } else {
        var deferred = $q.defer();
        getArticles()
          .then(function() {
            deferred.resolve(_.find(articles, 'id', articleId));
          });
        return deferred.promise;
      }
    }

    function initItem(item) {
      return angular.extend({}, item, {
        guid: item.$id
      });
    }

    function initArray(array) {
      articles = array;
      return array; // _.map(array, initItem);
    }


    function addFavorites(article) {
      favorites.push(article);
    }

    function removeFavorite(article) {
      favorites = _.without(favorites, article);
    }

    function getFavorites() {
      return favorites;
    }

    function isFavorite(article) {
      return _.contains(favorites, article);
    }

    function getSearchResults(){
      return searchResults;
    }

    function ddMmYyyToDate(date){
      var dateParts = date.split('/');
      var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      return dateObject;
    }

    function searchFor(data){
      searchResults = _.filter(articles, function(article)
      {
        return (
          _.isMatch(article, {title: data.text}) ||
          _.isMatch(article, {organizer: data.text}) ||
          _.isMatch(article, {location: data.text}) ||
          (ddMmYyyToDate(article.date_start) <= data.date && data.date <= ddMmYyyToDate(article.date_end))
        );
      }
      );
    }

  }
})();
