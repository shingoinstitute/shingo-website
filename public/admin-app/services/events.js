(function() {
  angular.module('app')
    .factory('events', ['$http', getEvents]);

  function getEvents($http) {
    return {
      get: function() {
        return $http.get('/api')
          .success(function(data) {
            return data;
          })
          .error(function(data) {
            return data;
          });
      },
      post: function(event) {
        // var data = $.param({
        //   event: JSON.stringify(event)
        // });
        // console.log("Data " + data);
        return $http({
            method: 'post',
            url: '/api',
            data: event
          })
          .success(function(data, status) {
            return data;
          })
          .error(function(data) {
            return data;
          });
      }
    }
  }
})();
