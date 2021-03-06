(function() {
	'use strict';

	angular
	.module('supermodular.wordpress')
	.controller('WordpressArticleController', WordpressArticleController);

	WordpressArticleController.$inject = ['$scope', '$window', '$stateParams', '$ionicActionSheet', '$cordovaSocialSharing', 'wordpressService'];

	/* @ngInject */
	function WordpressArticleController($scope, $window, $stateParams, $ionicActionSheet, $cordovaSocialSharing, wordpressService) {
		var articleId = parseInt($stateParams.articleId, 10);
		var vm = angular.extend(this, {
			article: null,
			shownItem : null,
			share: share,
			isItemShown : isItemShown,
			toggleItem : toggleItem,
			testFunc : testFunc,
			isFav: false,
			openPdf: openPdf,
			goToUrl: goToUrl
		});

		function activate() {
			//$scope.$on("addFav", function(event, data) { toggleFavorite(); } );
			//$scope.$on("isFav", function(event, data) { console.log('mpjka toogle'); } );
			loadArticle();
		}
		activate();

		// ********************************************************************


		/* delete
		function toggleFavorite(){
			console.log('mpjka toogle');
			vm.isFav = (!vm.isFav);

		} */

		/* delete
		function isFavorite(){
			console.log(vm.isFav);
			return vm.isFav;
		} */

		function share() {
			$ionicActionSheet.show({
				buttons: [
					{ text: 'Facebook' },
					{ text: 'Twitter' },
					{ text: 'Email' },
					{ text: 'Share' }
				],
				titleText: 'Share',
				cancelText: 'Cancel',
				buttonClicked: function(index) {
					switch(index) {
						case 0:
						shareToFacebook();
						break;
						case 1:
						shareToTwitter();
						break;
						case 2:
						shareViaEmail();
						break;
						case 3:
						shareNative();
						break;
					}
					return true;
				}
			});
		}

		function shareNative() {
			var message = vm.article.title;
			var subject = vm.article.title;

			$cordovaSocialSharing
			.share(message, subject, null, vm.article.url);
		}

		function shareToFacebook() {
			var message = vm.article.title;
			var image = vm.article.image;
			var link = vm.article.url;

			$cordovaSocialSharing
			.shareViaFacebook(message, image, link);
		}

		function shareToTwitter() {
			var message = vm.article.title + ' ' + vm.article.url;
			var image = vm.article.image;
			var link = vm.article.url;

			$cordovaSocialSharing
			.shareViaTwitter(message, image, link);
		}

		function shareViaEmail() {
			var message = 'Read more about "' + vm.article.title + '" ' + vm.article.url;
			var subject = vm.article.title;
			$cordovaSocialSharing
			.shareViaEmail(message, subject, [], [], [], null);
		}

		function loadArticle() {
			wordpressService.getArticle(articleId)
			.then(function(article) {
				vm.article = article;
			});
		}
		function toggleItem(entry) {
			if (isItemShown(entry)) {
				vm.shownItem = null;
				} else {
				vm.shownItem = entry;
			}
		}
		function isItemShown(entry) {
			return vm.shownItem === entry;
		}

		function openPdf(url){
			handleDocumentWithURL(
				function() {console.log('success');},
				function(error) {
					console.log('failure');
					if(error == 53) {
						console.log('No app that handles this file type.');
					}
				},
				url
			);
		}

		function goToUrl(url){
			$window.open(url, '_system', 'location=yes');
			//return false;
		}

		function testFunc(){
			console.log('I ran');
		}

	}
})();
