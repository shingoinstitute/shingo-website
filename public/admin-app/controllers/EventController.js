(function(){
  angular.module('app')
  .controller('EventController', ['$scope', 'events', '$routeParams', EventController]);

  function EventController ($scope, events, $routeParams){
    var vm = this;
    vm.saveEvent = function(event){
      events.post(event).success(function(data){
        vm.ev = data
      }).error(function(data){
        vm.error = "An error occured"
      });
    }
    events.get().success(function(data) {
      vm.ev = data[$routeParams.id];
    });
  }
})();
