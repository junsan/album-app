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

	$scope.album1 = [ 
				{title: 'Title1', duration: 10},
				{title: 'Title2', duration: 20},
				{title: 'Title3', duration: 30}
		];	

	$scope.album2 = [ 
				{title: 'Title4', duration: 40},
				{title: 'Title5', duration: 50},
				{title: 'Title6', duration: 60}
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

	// Album Obj	
	$scope.albumsObj = {
		songs: {},
		remaingSongs: [],

		setSongs: function (songs) {
			this.songs = songs;
			// Put song durations in an array and sort it by ASC order
			var arr = [];
			angular.forEach(this.songs, function(song) {
				arr.push(song.duration);
			});
			arr.sort(function(a,b) { return a-b; });
			this.remaingSongs = arr;
		},

		listenReqSongs: function (req) {
			if(this.remaingSongs.length<req) return false;
			var listenedSecs = 0;
			for(var x=0;x<req;x++) {
				listenedSecs = listenedSecs + parseInt(this.remaingSongs[x]);
				this.songsListened++;
				// remove songs already listened
				this.removeSong(this.remaingSongs[x]);
			}
			return listenedSecs;
		},

		removeSong: function(v) {
			var index = this.remaingSongs.indexOf(v);
			this.remaingSongs.splice(index, 1);
		},

		getFirstSong: function() {
			if(this.remaingSongs.length == 0) return false;
			return this.remaingSongs[0];
		},

		listen: function() {
			var song = this.getFirstSong();
			this.removeSong(song);
			return parseInt(song);
		}

	} 	

	var is_exceed = function() {
		if(totalListenedSecs >= maxSecs) return 1;
		return 0;
	}


	var addSong = function() {
		var no_songs = false;

		if(albumObj1.remaingSongs.length == 0 && albumObj2.remaingSongs.length == 0 ) {
			no_songs = true;
		} else if(albumObj1.remaingSongs.length > 0 && albumObj2.remaingSongs.length == 0 ) {
			totalListenedSecs = totalListenedSecs + albumObj1.listen();
		} else if(albumObj2.remaingSongs.length > 0  && albumObj1.remaingSongs.length == 0) {
			totalListenedSecs = totalListenedSecs + albumObj2.listen();
		} else if(albumObj1.remaingSongs[0] <= albumObj2.remaingSongs[0]) {
			totalListenedSecs = totalListenedSecs + albumObj1.listen();
		} else {
			totalListenedSecs = totalListenedSecs + albumObj2.listen();
		}

		if(!is_exceed()) {
			if(!no_songs) {
				//console.log(totalListenedSecs);
				$scope.songsListened++;
				addSong();
			}
		}

		return ($scope.reqSongs * 2) + $scope.songsListened;
		//console.log(totalListenedSecs);
	}	

	var albumObj1 = $scope.albumsObj;
	var albumObj2 = angular.copy(albumObj1);


	$scope.main = function() {
		totalListenedSecs = 0;
		$scope.songsListened = 0;
		maxSecs = $scope.maxMins * 60;

		// set songs both album
		albumObj1.setSongs($scope.album1);
		albumObj2.setSongs($scope.album2);

		var a1 = albumObj1.listenReqSongs($scope.reqSongs);
		var a2 = albumObj2.listenReqSongs($scope.reqSongs);

		if(a1 && a2) {
			totalListenedSecs = a1 + a2;
			if(!is_exceed()) {
				$scope.songsListened = addSong();	
			} else {
				$scope.songsListened = -1;
			}
		} else {
			$scope.songsListened = -1;
		}

		//console.log($scope.songsListened);
	}

});