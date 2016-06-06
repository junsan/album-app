app.factory('songsAPI', function($http) {

      var songsAPI = {};

      songsAPI.getSongs = function() {
          return $http({
              method: 'GET',
              url: 'http://localhost/angular/albums/api/songs.json'
          });
      }

      return songsAPI;
});