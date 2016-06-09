app.controller('albumsCtrl', function($scope, songsAPI) {
	'use strict';

	$scope.reqSongs = 1;
	$scope.maxMins = 2;
	$scope.songsListened = 0;
	$scope.showAdd = false;
	var maxSecs = 0;
	var totalListenedSecs = 0;

	$scope.allSongs = [];

	// get songs from API
	songsAPI.getSongs().then(function (response) {
		$scope.allSongs = response.data[0].songs;
	});

	$scope.albums = [ 
						{	name: 'Album1', 
							artist: 'Random', 
							cat: 'Pop',
							songs: [ {title: 'Title1', duration: 10},
									 {title: 'Title2', duration: 20},
									 {title: 'Title3', duration: 30} 
								   ]
						},
						{ 	name: 'Album2', 
							artist: 'Random', 
							cat: 'Rock',
							songs: [ 
										{title: 'Title4', duration: 40},
										{title: 'Title5', duration: 50},
										{title: 'Title6', duration: 60}
								   ]
						}
				];
	
	//watch
	$scope.$watch('maxMins', function(newValue, oldValue) {
		//console.log(newValue, oldValue);
	});

	$scope.s1 = {
		show: false,
		showAdd: function () {
			this.show = true;
		}
	}

	$scope.s2 = angular.copy($scope.s1);

	// album obj	
	$scope.albumsObj = {
		songs: {},
		remaingSongs: [],

		// put song duration in an array remainingSongs[] and sort it by ASC order
		setSongs: function (songs) {
			this.songs = songs;
			var arr = [];
			angular.forEach(this.songs, function(song) {
				arr.push(song.duration);
			});
			arr.sort(function(a,b) { return a-b; });
			this.remaingSongs = arr;
		},

		// listened to the required song and remove it in the array remainingSongs[]
		listenReqSongs: function (req) {
			// check if there is enough song if not return false
			if(this.remaingSongs.length<req) return false;
			var listenedSecs = 0;
			for(var x=0;x<req;x++) {
				listenedSecs = listenedSecs + parseInt(this.remaingSongs[x]);
				this.songsListened++;
				this.removeSong(this.remaingSongs[x]);
			}
			return listenedSecs;
		},

		// remove a song already listened
		removeSong: function(v) {
			var index = this.remaingSongs.indexOf(v);
			this.remaingSongs.splice(index, 1);
		},

		// check if there still remaingSongs songs
		getSong: function() {
			if(this.remaingSongs.length == 0) return false;
			return this.remaingSongs[0];
		},

		// listen to a song and remove it in the array remainingSongs[]
		listen: function() {
			var song = this.getSong();
			this.removeSong(song);
			return parseInt(song);
		}

	} 	

	// check if the total listened is already in max
	var is_exceed = function() {
		if(totalListenedSecs >= maxSecs) return 1;
		return 0;
	}

	// add a song to listen if still not in max
	var addSong = function() {
		var no_songs = false;
		var song1 = albumObj1.getSong();
		var song2 = albumObj1.getSong();

		if(song1 && song2) {
			totalListenedSecs += (song1 <= song2) ?  albumObj1.listen() : albumObj2.listen();
		} else if(song1 && !song2 ) {
			totalListenedSecs += albumObj1.listen();
		} else if(!song1 && song2 ) {
			totalListenedSecs += albumObj2.listen();
		} else {
			no_songs = true;
		}

		// add a song if there still available and still not exceed the max time
		if(!is_exceed()) {
			if(!no_songs) {
				$scope.songsListened++;
				addSong();
			}
		}

		// return the total number of songs listened
		return ($scope.reqSongs * 2) + $scope.songsListened;
	}	

	var albumObj1 = $scope.albumsObj;
	var albumObj2 = angular.copy(albumObj1);

	$scope.main = function() {

		totalListenedSecs = 0;
		$scope.songsListened = 0;
		maxSecs = $scope.maxMins * 60;

		albumObj1.setSongs($scope.albums[0].songs);
		albumObj2.setSongs($scope.albums[1].songs);

		// check if min required songs is pass if yes return total songs listened in secs
		var passReq1 = albumObj1.listenReqSongs($scope.reqSongs);
		var passReq2 = albumObj2.listenReqSongs($scope.reqSongs);

		if(passReq1 && passReq2) {
			totalListenedSecs = passReq1 + passReq2;
			// check if already exceed the max time
			if(!is_exceed()) {
				$scope.songsListened = addSong();	
				console.log($scope.songsListened);
			} else {
				$scope.songsListened = -1;
			}
		} else {
			$scope.songsListened = -1;
		}
	}

});