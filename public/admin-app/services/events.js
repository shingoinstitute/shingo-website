app.factory('events', ['$http', function($http) {
    return $http.get('/api')
        .success(function(data) {
            return data;
        })
        .error(function(data) {
            return data;
        })
}])

app.factory('save', ['$http', function($http) {
    return $http.post("/api", data)
        .success(function(data, status) {
            return data;
        })
        .error(function(data) {
            return data
        })
}])
