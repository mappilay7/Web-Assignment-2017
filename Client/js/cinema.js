/*global angular  */

/* we 'inject' the ngRoute module into our app. This makes the routing functionality to be available to our app. */
//NB: ngRoute module for routing and deeplinking services and directives
var myApp = angular.module('myApp', ['ngRoute'])


myApp.config( ['$routeProvider', function($routeProvider) {
  $routeProvider
		 .when('/findMovies', {
      templateUrl: 'templates/findMovies.html',
      controller: 'searchController'
    })
    .when('/nowshowing', {
      templateUrl: 'templates/nowshowing.html',
      controller: 'nowshowingController'
    })
    .when('/cs', {
		  templateUrl: 'templates/cs.html',
      controller: 'csController'
		})
	.when('/details/:id', {
      templateUrl: 'templates/details.html',
      controller: 'detailsController'
    })
    .when('/favourites', {
      templateUrl: 'templates/favourites.html',
      controller: 'favouritesController'
    })
    .when('/trailers', {
		  templateUrl: 'templates/trailers.html',
      controller: 'trailersController'
		})
		.otherwise({
		  redirectTo: 'findMovies'
		})
	}])


myApp.controller('searchController', function($scope, $http) {
  $scope.message = 'This is the home screen'


  $scope.reqPost = function(req, res){
    
  	var url = 'https://cinema-turbo7.c9users.io/movies/'
  	console.log('POST ' +url)
  	$http.post(url).success(function(respoonse) {
      console.log(respoonse)
  	})
  }

  $scope.search = function($event) {
    console.log('search()')
    if ($event.which == 13 || $event.which == 113) { // enter key presses
      var searchTerm = $scope.searchTerm
      var url = ''
      if ($event.which == 13)
      	url = 'https://api.themoviedb.org/3/search/movie?api_key=55f277a42b59d35aabacbf447c33419b&language=en-US&page=1&include_adult=false&query='+searchTerm
      else if($event.which == 113)
      	url = 'https://cinema-turbo7.c9users.io/movies?q='+searchTerm

      console.log(url)
      $http.get(url).success(function(respo) {
        console.log(respo)
        if (respo.data)
        	$scope.movies = respo.data
        else if (respo.results)
        	$scope.movies = respo.results
          $scope.searchTerm = ''
      })
    }
  }

})

myApp.controller('nowshowingController', function($scope, $http) {
  $scope.message = 'This is the now playing screen'
  console.log('myAPI GET /search')
  var url ='https://cinema-turbo7.c9users.io/movies/now_playing'
  $http.get(url).success(function(respo) {
	  console.log(respo.message);
	  $scope.movies = respo.data;
	  $scope.nowTerm=''
  })


})

myApp.controller('csController', function($scope, $http) {
  $scope.message = 'This is the comingsoon screen'
  console.log('myAPI GET /search')
  var url ='https://cinema-turbo7.c9users.io/movies/upcoming'
  $http.get(url).success(function(respo) {
	  console.log(respo.message);
	  $scope.movies = respo.data;
	  $scope.comingTerm=''
  })


})

myApp.controller('detailsController', function($scope,  $routeParams, $http, $window) {
  $scope.message = 'This is the detail screen'
  $scope.id = $routeParams.id


  var url = 'https://cinema-turbo7.c9users.io/movies/find/' +  $scope.id
  //var url = 'https://www.googleapis.com/books/v1/volumes/' + $scope.id
  $http.get(url).success(function(rspMovie) {
  	if (rspMovie.code == 200){
	    console.log(rspMovie.message + $scope.id)
	    $scope.message = rspMovie.message
	    $scope.movie = {}
	  $scope.movie.title=rspMovie.data.title
	  $scope.movie.original_title= rspMovie.data.original_title
    $scope.movie.overview= rspMovie.data.overview
    $scope.movie.original_language= rspMovie.data.original_language
    $scope.movie.release_date= rspMovie.data.release_date
    $scope.movie.poster_path= rspMovie.data.poster_path
    $scope.movie.revenue=rspMovie.data.revenue
    $scope.movie.status=rspMovie.data.status
  	}
  	else
  		$window.alert(rspMovie.message)
  })

	$scope.postLike = function(like) {
		if (like===1 || like===-1) {
			var data = {}
			data.like = like
			$http.post(url, data).success((respo) => {
					$window.alert(respo.message + '\n Likes:' + respo.like + '  Dislikes:' + respo.dislike)
			})
		}
	}

  $scope.addToFavourites = function(id) {
    console.log('adding: '+id+' to favourites.')
    localStorage.setItem(id)
  }
});






